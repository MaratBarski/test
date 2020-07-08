import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './pages/user-list/user-list.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { CoreModule } from '@appcore';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { ResearchListComponent } from './pages/research-list/research-list.component';

const routes: Array<Route> = [
  { path: '', component: UserListComponent },
  { path: 'research', component: ResearchListComponent }
]

@NgModule({
  declarations: [UserListComponent, UserDetailsComponent, ResearchListComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class UsersModule { }
