import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportedFilesComponent } from './pages/imported-files/imported-files.component';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from 'appcore';
import { UploadFileComponent } from '../shared/components/upload-file/upload-file.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { StoreModule } from '@ngrx/store';
import { fileSource } from './store/reducers/imported-files.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SourceFileEffect } from './store/effects/imported-files-load.effect';
import { MyQueriesComponent } from './pages/my-queries/my-queries.component';

const routes: Array<Route> = [
  { path: '', component: ImportedFilesComponent },
  { path: 'my-queries', component: MyQueriesComponent }
]

@NgModule({
  declarations: [
    ImportedFilesComponent,
    UploadFileComponent,
    MyQueriesComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('fileSource', fileSource),
    EffectsModule.forFeature([SourceFileEffect])
  ]
})
export class ImportedFilesModule { }


