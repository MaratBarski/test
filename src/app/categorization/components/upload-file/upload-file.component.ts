import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { UploadService, UploadStatus } from '@app/shared/services/upload.service';
import { ENV, CsvManagerService } from '@app/core-api';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { SelectOption } from 'projects/core/src/public-api';

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
  @Input() set uploadUrl(uploadUrl: string) { this._uploadUrl = uploadUrl; }
  get uploadUrl(): string { return this._uploadUrl; }
  description = '';
  hierarchyName = '';
  project = '';
  file = '';
  fileName = '';
  get isValid(): boolean {
    return !!this.file;
  }

  @Offline(`${environment.serverUrl}${environment.endPoints.uploadHierarchy}`)
  private _uploadUrl = `${environment.serverUrl}${environment.endPoints.uploadHierarchy}`;

  uploadFile(event: any): void {
    event.preventDefault();
    if (!this.isValid) {
      return;
    }
    const formData: FormData = new FormData();
    formData.append('file', this.fileInput.nativeElement.files[0]);
    formData.append('hierarchyName', this.fileName);
    formData.append('description', this.description);
    formData.append('projectId', this.project);
    this.uploadService.add({
      title: 'Categorization',
      form: formData,
      url: this._uploadUrl,
      status: UploadStatus.waiting,
      progress: 0
    });
    this.reset();
    this.onUpload.emit();
  }


  cancel(): void {
    this.reset();
    event.preventDefault();
    this.onCancel.emit();
  }

  changedProject(id: string): void {
    this.project = id;
  }

  reset(): void {
    this.description = '';
    this.fileName = '';
    this.project = '';
    this.file = '';
  }

  categoryHeaders: Array<string>;
  readFile(file: any): void {
    this.csvManagerService.readHeaders(file).then((arr: Array<string>) => {
      this.categoryHeaders = arr.map((str, i) => {
        return str;
        //return { text: str, value: i, id: i }
      });
    }).catch(error => {
      alert(error);
    });
  }

  updateFileName(event: any): void {
    this.file = this.fileInput.nativeElement.value;
    this.readFile(this.fileInput.nativeElement.files[0]);
  }
}
