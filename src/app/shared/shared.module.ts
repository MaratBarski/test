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
import { ProjectComboComponent } from './components/project-combo/project-combo.component';
import { CoreModule } from '@app/core-api';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { PageBodyComponent } from './components/page-body/page-body.component';

@NgModule({
  declarations: [
    UploadFileComponent,
    ProjectComboComponent, PageTitleComponent, PageBodyComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatSlideToggleModule
  ],
  exports: [
    UploadFileComponent,
    ProjectComboComponent,
    PageTitleComponent,
    PageBodyComponent
  ],
  entryComponents: [
  ]
})
export class SharedModule { }
