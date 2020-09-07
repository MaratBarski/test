import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivateComponent} from '../activate/pages/activate/activate.component';
import {Route, RouterModule} from '@angular/router';
import {ActivateService} from '@app/activate/services/activate.service';
import {CoreModule} from '@appcore';
import {ColumnComponent} from './components/column/column.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterColumnsPipe} from './pipes/filter-columns.pipe';

const routes: Array<Route> = [
  {path: '', component: ActivateComponent},
  {path: ':fileId', component: ActivateComponent, resolve: {data: ActivateService}},
  // { path: 'my-queries', component: MyQueriesComponent }
];

@NgModule({
  declarations: [ActivateComponent, ColumnComponent, FilterColumnsPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ActivateModule {
}
