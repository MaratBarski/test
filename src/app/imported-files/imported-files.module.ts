import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportedFilesComponent } from './pages/imported-files/imported-files.component';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from '@mdclone/core';
import { UploadFileComponent } from '../shared/components/upload-file/upload-file.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

const routes: Array<Route> = [
  { path: '', component: ImportedFilesComponent }
]

@NgModule({
  declarations: [
    ImportedFilesComponent,
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ImportedFilesModule { }


