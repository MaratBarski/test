import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportedFilesComponent } from './pages/imported-files/imported-files.component';
import { ImportedFileMappingComponent } from './pages/imported-files-mapping/imported-files-mapping.component';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from '@appcore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { StoreModule } from '@ngrx/store';
import { fileSource } from './store/reducers/imported-files.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SourceFileEffect } from './store/effects/imported-files-load.effect';
import { MyQueriesComponent } from './pages/my-queries/my-queries.component';
import { SharedModule } from '@app/shared/shared.module';
import { ImportedFilesMappingService } from './services/imported-files-mapping.service';
import { SourceFileDeleteEffect } from './store/effects/imported-file-delete.effect';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

const routes: Array<Route> = [
  { path: '', component: ImportedFilesComponent },
  { path: ':id', component: ImportedFileMappingComponent, resolve: { data: ImportedFilesMappingService } },
  { path: 'my-queries', component: MyQueriesComponent }
]

@NgModule({
  declarations: [
    ImportedFilesComponent,
    ImportedFileMappingComponent,
    MyQueriesComponent,
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('fileSource', fileSource),
    EffectsModule.forFeature([SourceFileEffect, SourceFileDeleteEffect])
  ]
})
export class ImportedFilesModule { }


