import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginService } from '@mdclone/core';

const routes: Routes = [
  {
    path: 'main',
    loadChildren: './main/main.module#MainModule',
    canActivate: [LoginService]
  },
  {
    path: 'patient',
    loadChildren: './patient/patient.module#PatientModule',
    canActivate: [LoginService]
  },
  {
    path: 'imported-files',
    loadChildren: './imported-files/imported-files.module#ImportedFilesModule',
    canActivate: [LoginService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }