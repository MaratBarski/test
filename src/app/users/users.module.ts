import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './pages/user-list/user-list.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { CoreModule } from '@appcore';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { ResearchListComponent } from './pages/research-list/research-list.component';
import { PermissionWizardComponent } from './pages/permission-wizard/permission-wizard.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { Step1Component } from './components/steps/step1/step1.component';
import { Step2Component } from './components/steps/step2/step2.component';
import { Step3Component } from './components/steps/step3/step3.component';
import { RuleItemComponent } from './components/rule-item/rule-item.component';

const routes: Array<Route> = [
  { path: '', component: UserListComponent },
  { path: 'research', component: ResearchListComponent },
  { path: 'edit-permissions', component: PermissionWizardComponent }
]

@NgModule({
  declarations: [UserListComponent, UserDetailsComponent, ResearchListComponent, PermissionWizardComponent, FooterComponent, HeaderComponent, TabsComponent, Step1Component, Step2Component, Step3Component, RuleItemComponent],
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
