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
import { CsvComboComponent } from './components/csv-combo/csv-combo.component';
import { DownloadSelectorComponent } from './components/download-selector/download-selector.component';
import { PageFotterComponent } from './components/page-fotter/page-fotter.component';
import { ReplacePipe } from './pipes/replace.pipe';
import { DataSamplePipe } from './pipes/data-sample.pipe';
import { FormatNumberPipe } from './pipes/format-number.pipe';
import { LegendComponent } from './components/legend/legend.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import {TooltipModule} from 'primeng/tooltip';
import { UserProjectPipe } from './pipes/user-project.pipe';
import { ToolTipManagerDirective } from './directives/tool-tip-manager.directive';

@NgModule({
  declarations: [
    ProjectComboComponent,
    PageTitleComponent,
    PageBodyComponent,
    AnimationStickyDirective,
    CsvComboComponent,
    DownloadSelectorComponent,
    PageFotterComponent,
    ReplacePipe,
    DataSamplePipe,
    FormatNumberPipe,
    LegendComponent,
    ConfirmDialogComponent,
    UserProjectPipe,
    ToolTipManagerDirective
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
    MatSlideToggleModule,
    TooltipModule
  ],
  exports: [
    ProjectComboComponent,
    PageTitleComponent,
    PageBodyComponent,
    AnimationStickyDirective,
    CsvComboComponent,
    DownloadSelectorComponent,
    PageFotterComponent,
    ReplacePipe,
    DataSamplePipe,
    FormatNumberPipe,
    ConfirmDialogComponent,
    TooltipModule,
    ToolTipManagerDirective
  ],
  entryComponents: [
  ]
})
export class SharedModule { }
