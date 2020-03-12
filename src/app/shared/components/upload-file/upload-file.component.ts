import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { UploadService, UploadStatus } from '@app/shared/services/upload.service';
import { ENV } from 'projects/core/src/public-api';
import { Offline } from '@app/shared/decorators/offline.decorator';

@Component({
  selector: 'md-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {

  constructor(private uploadService: UploadService) { }

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onUpload = new EventEmitter<void>();
  @Input() set uploadUrl(uploadUrl: string) { this._uploadUrl = uploadUrl; }
  get uploadUrl(): string { return this._uploadUrl; }
  fileType = false;
  project = '';
  fileName = '';
  file = '';
  get isValid(): boolean {
    return !!this.fileName && !!this.project && !!this.file;
  }

  @Offline(`${ENV.serverUrl}${ENV.endPoints.uploadFileSource}`)
  private _uploadUrl = `${ENV.serverUrl}${ENV.endPoints.uploadFileSource}`;

  uploadFile(event: any): void {
    event.preventDefault();
    if (!this.isValid) {
      return;
    }
    const formData: FormData = new FormData();
    formData.append('file', this.fileInput.nativeElement.files[0]);
    formData.append('fileName', this.fileName);
    formData.append('project', this.project);
    formData.append('fileType', this.fileType ? '1' : '0');
    this.uploadService.add({
      title: 'File source',
      form: formData,
      url: this._uploadUrl,
      status: UploadStatus.waiting,
      progress: 0
    });
    this.reset();
    this.onUpload.emit();
  }

  changedProject(id: string): void {
    this.project = id;
  }

  cancel(): void {
    this.reset();
    event.preventDefault();
    this.onCancel.emit();
  }

  reset(): void {
    this.fileName = '';
    this.file = '';
    this.project = '';
    this.fileType = false;
  }

  updateFileName(event: any): void {
    this.file = this.fileInput.nativeElement.value;
  }
}
