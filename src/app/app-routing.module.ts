import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginService } from './core-api';

const routes: Routes = [
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
    path: 'test',
    loadChildren: () => import('./test/test.module').then(m => m.TestModule)
  },
  {
    path: '',
    redirectTo: 'imported-files',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }