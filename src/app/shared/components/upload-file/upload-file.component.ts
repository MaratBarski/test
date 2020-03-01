import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectOption } from '../../../core-api';

@Component({
  selector: 'md-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  @Output() onCancel = new EventEmitter<void>();
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

    this.selectOptions = [];
    for (let i = 0; i < 10; i++) {
      this.selectOptions.push({
        text: `Option number : ${i + 1}`
      })
    }
    this.selectedOption = this.selectOptions[1];
  }

  uploadFile(event: any): void {
    event.preventDefault();
    alert(JSON.stringify(this.formGroup.value))
    if (!this.formGroup.valid) {
      return;
    }
  }

  cancel(event: any): void {
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
