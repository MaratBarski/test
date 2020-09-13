import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginService } from '@appcore';

const routes: Routes = [
  {
    path: 'patient',
    loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule),
    canActivate: [LoginService]
  },
  {
    path: 'activate',
    loadChildren: () => import('./activate/activate.module').then(m => m.ActivateModule),
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
    path: 'history-report',
    loadChildren: () => import('./history-report/history-report.module').then(m => m.HistoryReportModule),
    canActivate: [LoginService]
  },
  {
    path: 'usage-dashboard',
    loadChildren: () => import('./usage/usage.module').then(m => m.UsageModule),
    canActivate: [LoginService]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canActivate: [LoginService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then(m => m.TestModule)
  },
  {
    path: '',
    redirectTo: 'imported-files',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'imported-files',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
