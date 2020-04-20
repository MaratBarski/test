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
import { MapCategoriesComponent } from './pages/map-categories/map-categories.component';
import { CategoryInfoComponent } from './components/category-info/category-info.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { EditCategoriesComponent } from './pages/edit-categories/edit-categories.component';
import { MapCategoryInfoComponent } from './components/map-category-info/map-category-info.component';
import { MapCategoryTableComponent } from './components/map-category-table/map-category-table.component';
import { EditCategoryTableComponent } from './components/edit-category-table/edit-category-table.component';
import { MapCategoryHeaderComponent } from './components/map-category-header/map-category-header.component';

const routes: Array<Route> = [
  { path: '', component: CategorizationComponent },
  { path: 'map-categories', component: MapCategoriesComponent },
  { path: 'edit-categories', component: EditCategoriesComponent }
]

@NgModule({
  declarations: [
    CategorizationComponent,
    MapCategoriesComponent,
    CategoryInfoComponent,
    UploadFileComponent,
    EditCategoriesComponent,
    MapCategoryInfoComponent,
    MapCategoryTableComponent,
    EditCategoryTableComponent,
    MapCategoryHeaderComponent
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

