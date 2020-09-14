import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivateComponent} from '../activate/pages/activate/activate.component';
import {Route, RouterModule} from '@angular/router';
import {ActivateService} from '@app/activate/services/activate.service';
import {CoreModule} from '@appcore';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterColumnsPipe} from './pipes/filter-columns.pipe';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TopPanelComponent } from './components/top-panel/top-panel.component';
import { SelectedColumnPipe } from './pipes/selected-column.pipe';

const routes: Array<Route> = [
  {path: '', component: ActivateComponent},
  {path: ':fileId', component: ActivateComponent, resolve: {data: ActivateService}},
  // { path: 'my-queries', component: MyQueriesComponent }
];

@NgModule({
  declarations: [ActivateComponent, FilterColumnsPipe, TopPanelComponent, SelectedColumnPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule
  ]
})
export class ActivateModule {
}
