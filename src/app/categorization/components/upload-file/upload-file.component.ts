import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { UploadService } from '@app/shared/services/upload.service';
import { CsvManagerService, NotificationStatus, ToasterType } from '@appcore';
import { environment } from '@env/environment';
import { Offline } from '@app/shared/decorators/offline.decorator';

@Component({
  selector: 'md-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {

  constructor(private uploadService: UploadService, private csvManagerService: CsvManagerService) { }

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
    this.uploadService.add({
      notification: {
        name: 'Uploading Categorization',
        failName: `Failed to upload ${this.fileName}.`,
        failComment:'Upload error',
        succName: 'Categorization SUCCESSFULLY UPLOADED',
        abortName: 'Categorization UPLOAD ABORTED BY USER',
        comment: 'You will be notified when its ready for review.',
        succComment: `Upload of ${this.fileName} was successful and it is ready for review.`,
        progress: 0,
        status: NotificationStatus.uploading,
        showProgress: true,
        showInContainer: true,
        startDate: new Date(),
        progressTitle: this.fileName,
        type: ToasterType.infoProgressBar,
        showInToaster: true
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
    formData.append('defaultLevelId', this.defaultCategory);
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
      this.categoryHeaders = arr.map((str, i) => {
        return str;
        //return { text: str, value: i, id: i }
      });
    }).catch(error => {
      this.categoryHeaders = [];
      this.file = '';
      this.isFileError = true;
    });

  }

  updateFileName(event: any): void {
    this.file = this.fileInput.nativeElement.value;
    this.readFile(this.fileInput.nativeElement.files[0]);
    this.defaultCategory = '0';
  }

  changedProject(id: string): void {
    this.project = id;
  }

  changeDefaultCategory(id: string): void {
    this.defaultCategory = id;
  }
}
