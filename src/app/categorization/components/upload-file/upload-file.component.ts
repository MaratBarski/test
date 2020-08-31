import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { UploadService } from '@app/shared/services/upload.service';
import { CsvManagerService, NotificationStatus, ToasterType, ValidationFileMessage, ExcelExtentions } from '@appcore';
import { environment } from '@env/environment';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { ConfigService } from '@app/shared/services/config.service';

@Component({
  selector: 'md-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {

  constructor(
    private uploadService: UploadService, 
    private csvManagerService: CsvManagerService,
    private configService: ConfigService
    ) { }

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onUpload = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<any>();

  @Input() targetComponent: any;
  @Input() set uploadUrl(uploadUrl: string) { this._uploadUrl = uploadUrl; }
  @Input() set source(source: any) {
    this._source = source;
  }
  get source(): any { return this._source; }
  private _source: any;

  get isEditMode(): boolean {
    return !!this.source;
  }
  get uploadUrl(): string { return this._uploadUrl; }
  description = '';
  fileName = '';
  file = '';
  project = '';
  defaultCategory = '0';
  categoryHeaders: Array<string>;
  isFileError = false;

  get isValid(): boolean {
    return (!!this.fileName || this.isEditMode) && !!this.file && (!!this.project || this.isEditMode);
  }

  @Offline('http://localhost:57858/api/Config/')
  private _uploadUrl = `${environment.serverUrl}${environment.endPoints.uploadHierarchy}`;

  uploadFile(event: any): void {
    event.preventDefault();
    if (!this.isValid) {
      return;
    }
    const formData: FormData = this.createFormData();
    this.uploadService.addWithKey({
      notification: {
        name: 'Uploading Categorization',
        failName: `Failed to upload ${this.fileName}.`,
        failComment: 'Try again or contact MDClone support.',
        succName: 'Categorization file uploaded successfully.',
        abortName: 'Aborted successfully.',
        abortComment: `Upload of ${this.fileName} was successfully aborted.`,
        comment: 'You will be notified when its ready for review.',
        succComment: `Upload of ${this.fileName} was successful and it is ready for review.`,
        progress: 0,
        status: NotificationStatus.uploading,
        showProgress: true,
        showInContainer: true,
        startDate: new Date(),
        progressTitle: `${this.fileName}`,
        type: ToasterType.infoProgressBar,
        showInToaster: true,
        containerEnable: true
      },
      form: formData,
      url: this._uploadUrl,
      targetComponent: this.targetComponent
    });
    this.reset();
    this.onUpload.emit();
  }

  changeFile(event: any): void {
    event.preventDefault();
    // if (!this.isValid) {
    //   return;
    // }
    const formData: FormData = this.createFormData();
    this.onChange.emit({
      formData: formData,
      categoryHeaders: this.categoryHeaders,
      defaultCategory: this.defaultCategory
    });

    this.reset();
  }

  createFormData(): FormData {
    const formData: FormData = new FormData();
    formData.append('file', this.fileInput.nativeElement.files[0]);
    formData.append('fileName', this.fileName);
    formData.append('description', this.description);
    formData.append('hierarchyName', this.fileName);
    if (!this.isEditMode) {
      formData.append('projectId', this.project);
    } else {
      formData.append('hierarchyRootId', this.source.hierarchyRootId);
    }
    formData.append('defaultLevelId', '' + (parseInt(this.defaultCategory) - 1));
    //formData.append('type', 'manual');
    return formData;
  }

  cancel(): void {
    this.reset();
    event.preventDefault();
    this.onCancel.emit();
  }

  reset(): void {
    this.fileName = '';
    this.file = '';
    this.description = '';
    this.defaultCategory = '0';
  }

  readFile(file: any): void {
    this.csvManagerService.readHeaders(file).then((arr: Array<string>) => {
      this.isFileError = false;
      this.categoryHeaders =
        //['Select default category...']
        [].concat(
          arr.map((str, i) => {
            return str;
            //return { text: str, value: i, id: i }
          }));
    }).catch(error => {
      this.categoryHeaders = [];
      this.file = '';
      this.fileErrorMessage = 'File format needs to be CSV (comma separate values)';
      this.isFileError = true;
    });

  }

  fileErrorMessage = 'File format needs to be CSV (comma separate values)';

  private fileError(error: ValidationFileMessage): void {
    this.file = '';
    this.fileInput.nativeElement.value = '';
    this.isFileError = true;
    this.fileErrorMessage = this.configService.config.fileValidationErrors[error];
  }

  updateFileName(event: any): void {
    this.fileErrorMessage = '';
    if (!this.fileInput.nativeElement.files.length) {
      return;
    }
    this.isFileError = false;
    if (!this.csvManagerService.validateFileExtention(this.fileInput.nativeElement, ExcelExtentions)) {
      this.fileError(ValidationFileMessage.CsvExtensionError);
      return;
    }
    if (!this.csvManagerService.validateFileName(this.fileInput.nativeElement)) {
      this.fileError(ValidationFileMessage.NoName);
      return;
    }
    if (!this.csvManagerService.validateFileEmpty(this.fileInput.nativeElement.files[0])) {
      this.fileError(ValidationFileMessage.FileEmpty);
      return;
    }
    if (!this.csvManagerService.validateFileSize(this.fileInput.nativeElement.files[0], 0, -1)) {
      this.fileError(ValidationFileMessage.FileSizeError);
      return;
    }

    this.csvManagerService.validate(this.fileInput.nativeElement.files[0]).then((res: ValidationFileMessage) => {
      if (res === ValidationFileMessage.Success) {
        this.csvManagerService.detectEncoding(this.fileInput.nativeElement.files[0]).then(encoding => {
          if (encoding.trim().toUpperCase() !== 'UTF8' && encoding.trim().toUpperCase() !== 'ASCII') {
            this.fileError(ValidationFileMessage.NoUtf8);
          } else {
            this.file = this.fileInput.nativeElement.value;
            this.readFile(this.fileInput.nativeElement.files[0]);
            this.defaultCategory = '0';
          }
        }).catch(e => {
          this.fileError(ValidationFileMessage.NoUtf8);
        });
        return;
      }
      this.fileError(res);
    }).catch(e => {
      this.fileError(ValidationFileMessage.OtherError);
    });

    // this.file = this.fileInput.nativeElement.value;
    // this.readFile(this.fileInput.nativeElement.files[0]);
    // this.defaultCategory = '0';
  }

  changedProject(id: string): void {
    this.project = id;
  }

  changeDefaultCategory(id: string): void {
    this.defaultCategory = id;
  }
}
