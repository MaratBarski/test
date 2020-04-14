import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsageDashboardComponent } from './pages/usage-dashboard/usage-dashboard.component';
import { Route, RouterModule } from '@angular/router';
import { CoreModule, ChartBarComponent } from '@app/core-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { UserTimeActivityComponent } from './components/user-time-activity/user-time-activity.component';
import { UsageDashboardTopComponent } from './components/usage-dashboard-top/usage-dashboard-top.component';
import { UsageDashboardInfoPanelComponent } from './components/usage-dashboard-info-panel/usage-dashboard-info-panel.component';
import { UsageReportComponent } from './components/usage-report/usage-report.component';
import { UsageTableComponent } from './components/usage-table/usage-table.component';
import { UsageMainComponent } from './pages/usage-main/usage-main.component';
import { UsageMonthlyComponent } from './components/usage-monthly/usage-monthly.component';
import { UsageUserActivityComponent } from './components/usage-user-activity/usage-user-activity.component';
import { UsageTopComponent } from './components/usage-top/usage-top.component';
import { UsageCreatedComponent } from './components/usage-created/usage-created.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartWraperComponent } from './components/chart-wraper/chart-wraper.component';
import { UsageRetentionComponent } from './components/usage-retention/usage-retention.component';
import { UsageHeaderComponent } from './components/usage-header/usage-header.component';
import { UserFilterComponent } from './components/user-filter/user-filter.component';
import { GeneralChartPipe } from './pipes/general-usage.pipe';
import { MonthlyChartPipe } from './pipes/monthly-activity.pipe';
import { UserActivityChartPipe } from './pipes/activity-per-user.pipe';
import { Top10ChartPipe } from './pipes/top-10-users.pipe';
import { CreatedChartPipe } from './pipes/created.pipe';
import { ChartPdfComponent } from './components/chart-pdf/chart-pdf.component';
import { UsageUserPipe } from './pipes/usage-user.pipe';

const routes: Array<Route> = [
  { path: 'test', component: UsageDashboardComponent },
  { path: 'main', component: UsageMainComponent },
  { path: 'general-usage', component: UsageMainComponent },
  { path: 'monthly-activity', component: UsageMainComponent },
  { path: 'activity-per-user', component: UsageMainComponent },
  { path: 'top-10-users', component: UsageMainComponent },
  { path: 'retention', component: UsageMainComponent },
  { path: 'created', component: UsageMainComponent },
  { path: 'table', component: UsageMainComponent },
  { path: '', redirectTo: 'general-usage', pathMatch: 'full' },
  { path: '**', redirectTo: 'general-usage', pathMatch: 'full' }

  //,{ path: ':state', component: UsageDashboardComponent }
]

@NgModule({
  declarations: [
    UsageDashboardComponent,
    UserTimeActivityComponent,
    UsageDashboardTopComponent,
    UsageDashboardInfoPanelComponent,
    UsageReportComponent,
    UsageTableComponent,
    UsageMainComponent,
    UsageMonthlyComponent,
    UsageUserActivityComponent,
    UsageTopComponent,
    UsageCreatedComponent,
    GeneralChartPipe,
    MonthlyChartPipe,
    UserActivityChartPipe,
    Top10ChartPipe,
    CreatedChartPipe,
    ChartWraperComponent,
    UsageRetentionComponent,
    UsageHeaderComponent,
    UserFilterComponent,
    ChartPdfComponent,
    UsageUserPipe
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgxChartsModule
  ],
  entryComponents: [
    ChartBarComponent
  ]
})

export class UsageModule { }
