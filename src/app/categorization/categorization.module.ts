import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CategorizationComponent } from './pages/categorization/categorization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from '@app/core-api';
import { categorization } from './store/reducers/categorization.reducer';
import { CategorizationLoadEffect } from './store/effects/categorization-load.effect';

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
    StoreModule.forFeature('categorization', categorization),
    EffectsModule.forFeature([CategorizationLoadEffect])
  ] 
})
export class CategorizationModule { }

