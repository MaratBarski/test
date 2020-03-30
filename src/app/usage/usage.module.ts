import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsageDashboardComponent } from './pages/usage-dashboard/usage-dashboard.component';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from '@app/core-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { UserTimeActivityComponent } from './components/user-time-activity/user-time-activity.component';

const routes: Array<Route> = [
  { path: '', component: UsageDashboardComponent }
]

@NgModule({
  declarations: [
    UsageDashboardComponent,
    UserTimeActivityComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class UsageModule { }
