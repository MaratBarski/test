import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginService } from './core-api';


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
    loadChildren: () => import('./imported-files/imported-files.module').then(m => m.ImportedFilesModule),
    canActivate: [LoginService]
  },
  {
    path: 'categorization',
    loadChildren: () => import('./categorization/categorization.module').then(m => m.CategorizationModule),
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