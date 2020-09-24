import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { Route, RouterModule } from '@angular/router';

const routes: Array<Route> = [
  { path: '', component: NoAccessComponent }
]

@NgModule({
  declarations: [NoAccessComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AccessUserModule { }
