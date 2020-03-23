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
import { ProjectComboComponent } from './components/project-combo/project-combo.component';
import { CoreModule } from '@app/core-api';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { PageBodyComponent } from './components/page-body/page-body.component';
import { AnimationStickyDirective } from './directives/animation-sticky.directive';

@NgModule({
  declarations: [
    ProjectComboComponent, 
    PageTitleComponent, 
    PageBodyComponent, 
    AnimationStickyDirective
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
    ProjectComboComponent,
    PageTitleComponent,
    PageBodyComponent,
    AnimationStickyDirective
  ],
  entryComponents: [
  ]
})
export class SharedModule { }
