import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatAutocompleteModule,
  MatSliderModule,
  MatSlideToggleModule
} from '@angular/material';
import { UploadFileComponent } from './components/upload-file/upload-file.component';


@NgModule({
  declarations: [UploadFileComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatSlideToggleModule
  ],
  entryComponents: []
})
export class SharedModule { }
