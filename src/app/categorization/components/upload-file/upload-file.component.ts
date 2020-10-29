import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { UploadService } from '@app/shared/services/upload.service';
import { CsvManagerService, NotificationStatus, ToasterType, ValidationFileMessage, ExcelExtentions, LoginService, ComponentService } from '@appcore';
import { environment } from '@env/environment';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { ConfigService } from '@app/shared/services/config.service';
import { CategorizationService } from '@app/categorization/services/categorization.service';


@Component({
  selector: 'md-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  constructor(
    private uploadService: UploadService,
    private csvManagerService: CsvManagerService,
    private configService: ConfigService,
    public loginService: LoginService,
    private categorizationService: CategorizationService,
    private componentService: ComponentService
  ) {
  }

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
  defaultCategory = '1';
  categoryHeaders: Array<string>;
  isFileError = false;

  get isValid(): boolean {
    return (!!this.fileName || this.isEditMode) && !!this.file && (!!this.project || this.isEditMode) && !this.fileNameErrorMessage;
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
        //failComment: 'Try again or contact MDClone support.',
        failComment: '',
        succName: 'Categorization file uploaded successfully.',
        abortName: 'Aborted successfully.',
        abortComment: `Upload of ${this.fileName} was successfully aborted.`,
        comment: this.configService.getValue('MI00003'),
        succComment: `Upload of ${this.fileName} was successful and it is ready for review.`,
        progress: 0,
        status: NotificationStatus.uploading,
        showProgress: true,
        showInContainer: true,
        startDate: new Date(),
        progressTitle: `${this.fileName}`,
        type: ToasterType.infoProgressBar,
        showInToaster: true,
        containerEnable: true,
        removeOnComplete: true,
        progressKf: 2,
        onComplete: () => {
          this.categorizationService.uploadComplete();
        }
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
    formData.append('defaultLevelId', '' + (parseInt(this.defaultCategory)));
    //formData.append('type', 'manual');
    return formData;
  }

  cancel(event: any): void {
    this.reset();
    event.preventDefault();
    this.onCancel.emit();
  }

  fileErrorName = '';
  reset(): void {
    this.fileName = '';
    this.file = '';
    this.fileErrorName = '';
    this.description = '';
    this.defaultCategory = '1';
  }

  fileNameErrorMessage: string = undefined;

  validateFileName(): void {
    if (!this.targetComponent || !this.targetComponent.categorySource) { return; }
    const files: Array<any> = this.targetComponent.categorySource;
    const found = files.find(x => {
      return x.hierarchyName && this.fileName && x.hierarchyName.toLowerCase() === this.fileName.toLowerCase();
    });
    if (found) {
      this.fileNameErrorMessage = this.configService.getMessage('E00027');
      //this.fileName = '';
    } else {
      this.fileNameErrorMessage = undefined;
    }
  }

  readFile(file: any): void {
    if (!this.csvManagerService.isCsv(file.name)) {
      this.isFileError = true;
      this.setFileError('File format is not allowed (only CSV files)');
      this.categoryHeaders = [];
      return;
    }
    this.csvManagerService.readHeaders(file).then((arr: Array<string>) => {
      this.isFileError = false;
      for (let i = 0; i < arr.length; i++) {
        if (!this.csvManagerService.validateSymbol(arr[i])) {
          this.fileError(ValidationFileMessage.NoEnglish);
          this.categoryHeaders = [];
          this.file = '';
          this.isFileError = true;
        }
      }

      if (!this.isFileError && this.fileInput.nativeElement.files[0].size < 10000) {
        this.csvManagerService.readBlock(0, this.fileInput.nativeElement.files[0].size, this.fileInput.nativeElement.files[0])
          .then(res => {
            const rows = res ? res.split('\n') : [];
            if (rows.length < 2 || !rows[1]) {
              this.fileError(ValidationFileMessage.NoRows);
              this.categoryHeaders = [];
              this.isFileError = true;
            }
          }).catch(() => {
            this.fileError(ValidationFileMessage.NoRows);
            this.categoryHeaders = [];
            this.isFileError = true;
          })
      }
      if (!this.isFileError) {
        this.categoryHeaders =
          //['Select default category...']
          [].concat(
            arr.map((str, i) => {
              return str;
              //return { text: str, value: i, id: i }
            }));
      }
    })
      .catch(error => {
        this.categoryHeaders = [];
        this.file = '';
        this.fileErrorMessage = 'File format needs to be CSV (comma separate values)';
        this.isFileError = true;
      });

  }

  fileErrorMessage = 'File format needs to be CSV (comma separate values)';

  private fileError(error: ValidationFileMessage, replacements: Array<any> = undefined): void {
    this.setFileError(this.configService.config.fileValidationErrors[error])
    if (replacements) {
      replacements.forEach(x => {
        this.fileErrorMessage = this.fileErrorMessage.replace(x[0], x[1]);
      })
    }
  }

  private setFileError(message: string): void {
    this.file = '';
    this.fileInput.nativeElement.value = '';
    this.isFileError = true;
    this.fileErrorMessage = message;
  }

  updateFileName(event: any): void {
    this.fileErrorMessage = '';
    if (!this.fileInput.nativeElement.files.length) {
      return;
    }
    this.fileErrorName = this.fileInput.nativeElement.value;
    this.isFileError = false;
    if (!this.csvManagerService.validateFileExtention(this.fileInput.nativeElement, ExcelExtentions)) {
      this.fileError(ValidationFileMessage.CsvExtensionError);
      return;
    }
    if (!this.csvManagerService.validateFileName(this.fileInput.nativeElement)) {
      this.fileError(ValidationFileMessage.NoName);
      return;
    }
    if (!this.csvManagerService.validateMaxSize(this.fileInput.nativeElement.files[0], parseInt(this.configService.getValue('file_upload_limit')))) {
      this.fileError(ValidationFileMessage.FileSizeLimitError, [['{maxSize}', this.configService.getValue('file_upload_limit')]]);
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
            this.fileName = this.componentService.getFileNameNoExt(this.file);
            this.validateFileName();
            this.readFile(this.fileInput.nativeElement.files[0]);
            this.defaultCategory = '1';
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
