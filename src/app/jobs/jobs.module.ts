import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListComponent } from './pages/job-list/job-list.component';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from '@app/core-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';

const routes: Array<Route> = [
  { path: '', component: JobListComponent }
];
  
@NgModule({
  declarations: [
    JobListComponent
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
export class JobsModule { }
