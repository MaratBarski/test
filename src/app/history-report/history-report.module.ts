import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputHistoryReportComponent } from './pages/output-history-report/output-history-report.component';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from '@app/core-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HistoryReportLoadEffect } from './store/effects/history-report-load.effect';
import { historyReport } from './store/reducers/history-report.reducer';
import { HistoryInfoComponent } from './components/history-info/history-info.component';

const routes: Array<Route> = [
  { path: '', component: OutputHistoryReportComponent }
]


@NgModule({
  declarations: [OutputHistoryReportComponent, HistoryInfoComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('history', historyReport),
    EffectsModule.forFeature([HistoryReportLoadEffect])
  ]
})
export class HistoryReportModule { }
