import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivateComponent} from '../activate/pages/activate/activate.component';
import {Route, RouterModule} from '@angular/router';
import {ActivateService} from '@app/activate/services/activate.service';
import {CoreModule} from '@appcore';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterColumnsPipe} from './pipes/filter-columns.pipe';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TopPanelComponent} from './components/top-panel/top-panel.component';
import {SelectedColumnPipe} from './pipes/selected-column.pipe';
import {FilterModalComponent} from './components/filter-modal/filter-modal.component';
import {CustomSelectComponent} from './components/custom-select/custom-select.component';
import {ConditionCardComponent} from './components/condition-card/condition-card.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {SharedModule} from '../shared/shared.module';

const routes: Array<Route> = [
  {path: '', component: ActivateComponent},
  {path: ':fileId', component: ActivateComponent, resolve: {data: ActivateService}},
  {path: ':fileId/:anonymityRequest', component: ActivateComponent, resolve: {data: ActivateService}}
];

@NgModule({
  declarations: [
    ActivateComponent,
    FilterColumnsPipe,
    TopPanelComponent,
    SelectedColumnPipe,
    FilterModalComponent,
    CustomSelectComponent,
    ConditionCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    PerfectScrollbarModule,
    SharedModule
  ]
})
export class ActivateModule {
}
