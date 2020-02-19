import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'main',
    loadChildren: './main/main.module#MainModule',
  },
  {
    path: 'patient',
    loadChildren: './patient/patient.module#PatientModule',
  },
  {
    path: 'imported-files',
    loadChildren: './imported-files/imported-files.module#ImportedFilesModule',
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }