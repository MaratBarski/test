import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from './pages/icons/icons.component';
import { SharedModule } from '@app/shared/shared.module';
import { CoreModule } from '@app/core-api';
import { RouterModule, Route } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Array<Route> = [
  { path: 'icons', component: IconsComponent },
  { path: '', redirectTo: 'icons', pathMatch: 'full' }
]


@NgModule({
  declarations: [IconsComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TestModule { }
