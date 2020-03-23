import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { UploadService, UploadStatus } from '@app/shared/services/upload.service';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { SelectOption, SelectComponent } from 'appcore';
import { environment } from '@env/environment';

@Component({
  selector: 'md-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {

  constructor(private uploadService: UploadService) { }

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  @ViewChild('templateSelector', { static: true }) templateSelector: SelectComponent;

  @Output() onCancel = new EventEmitter<void>();
  @Output() onUpload = new EventEmitter<void>();
  @Input() set uploadUrl(uploadUrl: string) { this._uploadUrl = uploadUrl; }
  @Input() templates: Array<SelectOption>;
  get uploadUrl(): string { return this._uploadUrl; }
  defaultTemplate: SelectOption = { text: 'Select Permission Group...', id: '', value: '' };

  fileType = false;
  project = '';
  fileName = '';
  file = '';
  template = '';
  get isValid(): boolean {
    return !!this.fileName && !!this.project && !!this.file;
  }

  @Offline(`${environment.serverUrl}${environment.endPoints.uploadFileSource}`)
  private _uploadUrl = `${environment.serverUrl}${environment.endPoints.uploadFileSource}`;

  resetTemplate(): void {
    this.templateSelector.selected = this.defaultTemplate;
    this.template = '';
  }

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
    formData.append('template', this.template);
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

  changedTemplate(template: any): void {
    this.template = template.id;
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
    this.template = '';
    this.fileType = false;
    this.fileInput.nativeElement.value = '';
  }

  updateFileName(event: any): void {
    this.file = this.fileInput.nativeElement.value;
  }
}
