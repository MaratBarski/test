import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' }
];



@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MainModule { }
