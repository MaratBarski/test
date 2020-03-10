import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectOption } from '../../../core-api';
import { UploadService, UploadStatus } from '@app/shared/services/upload.service';
import { ENV } from 'projects/core/src/public-api';
import { Offline } from '@app/shared/decorators/offline.decorator';

@Component({
  selector: 'md-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  constructor(private uploadService: UploadService) { }

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onUpload = new EventEmitter<void>();
  isShared = false;
  selectOptions: Array<SelectOption>;
  selectedOption: SelectOption;
  fileName = '';
  get isValid(): boolean {
    return this.formGroup.valid;
  }

  formGroup: FormGroup;

  ngOnInit() {
    this.formGroup = new FormGroup({
      typeFileName: new FormControl('', [
        Validators.required
      ]),
      file: new FormControl('', [
        Validators.required
      ])
    });

    this.selectOptions = [
      { text: 'Project1' },
      { text: 'Project2' }
    ];
    this.selectedOption = this.selectOptions[1];
  }

  @Offline(`${ENV.serverUrl}${ENV.endPoints.uploadFileSource}`)
  private _uploadUrl = `${ENV.serverUrl}${ENV.endPoints.uploadFileSource}`;

  uploadFile(event: any): void {
    event.preventDefault();
    //alert(JSON.stringify(this.formGroup.value));
    if (!this.formGroup.valid) {
      return;
    }
    const formData: FormData = new FormData();
    formData.append('file', this.fileInput.nativeElement.files[0]);
    formData.append('typeFileName', this.formGroup.value.typeFileName);
    formData.append('projectName', this.selectedOption.text);
    formData.append('isShared', this.isShared + '');
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

  changed(option: SelectOption): void {
    this.selectedOption = option;
  }

  cancel(): void {
    this.reset();
    event.preventDefault();
    this.onCancel.emit();
  }

  reset(): void {
    this.formGroup.reset();
    this.fileName = '';
  }

  updateFileName(event: any): void {
    this.fileName = this.formGroup.get('file').value;
  }
}
