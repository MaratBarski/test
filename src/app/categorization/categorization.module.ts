import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CategorizationComponent } from './pages/categorization/categorization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { fileSource } from '@app/imported-files/store/reducers/imported-files.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SourceFileEffect } from '@app/imported-files/store/effects/imported-files-load.effect';
import { CoreModule } from '@app/core-api';

const routes: Array<Route> = [
  { path: '', component: CategorizationComponent },
]

@NgModule({
  declarations: [
    CategorizationComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('fileSource', fileSource),
    EffectsModule.forFeature([SourceFileEffect])
  ]
})
export class CategorizationModule { }

