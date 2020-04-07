import { Component, Input, EventEmitter, ViewChild, ElementRef, Output } from '@angular/core';
import { CsvManagerService } from '../../services/csv-manager.service';

export interface FileInput {
  file?: any;
  error?: string;
  name?: string;
  headers?: Array<string>;
}

@Component({
  selector: 'mdc-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent {

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  @Input() topTitle = 'Choose File';
  @Input() buttonText = 'Choose File';
  @Input() selectFileText = 'Select a CSV or Excel file';
  @Input() defaultError = 'File format needs to be CSV (comma separate values)';
  @Input() accept = '.csv';
  @Input() readHeaders = true;

  @Output() onSelect = new EventEmitter<FileInput>();

  selectedFileName: string;
  isFileError = false;

  private _headers: Array<string>;

  get errorText(): string {
    return this._error ? this._error : this.defaultError;
  }
  private _error: string;

  constructor(private csvManagerService: CsvManagerService) { }

  private fileError(): void {
    this.selectedFileName = '';
    this.fileInput.nativeElement.value = '';
    this.isFileError = true;
  }

  private emit(): void {
    this.onSelect.emit({
      error: this.isFileError ? this.errorText : undefined,
      file: this.fileInput.nativeElement,
      name: this.fileInput.nativeElement.value,
      headers: this._headers
    });
  }

  reset(): void {
    this._headers = undefined;
    this._error = undefined;
    this.selectedFileName = undefined;
    this.isFileError = false;
  }

  updateFileName(event: any): void {
    if (!this.fileInput.nativeElement.files.length) {
      return;
    }
    this.isFileError = false;
    this._headers = undefined;
    if (!this.readHeaders) {
      this.emit();
      return;
    }
    this.csvManagerService.readHeaders(this.fileInput.nativeElement.files[0]).then(res => {
      if (res.length) {
        this.selectedFileName = this.fileInput.nativeElement.value;
        this._headers = res;
        this.emit();
        return;
      }
      this.fileError();
      this.emit();
    }).catch(e => {
      this.emit();
      this.fileError();
    });
  }
}
