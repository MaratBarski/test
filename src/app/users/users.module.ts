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
import { UserWizardComponent } from './pages/user-wizard/user-wizard.component';
import { EditUserGeneralComponent } from './components/user-steps/edit-user-general/edit-user-general.component';
import { EditPermissionSetComponent } from './components/user-steps/edit-permission-set/edit-permission-set.component';
import { UserNameSelectorComponent } from './components/forms/user-name-selector/user-name-selector.component';
import { InputItemComponent } from './components/forms/input-item/input-item.component';
import { DistinctTemplatePipe } from './pipes/distinct-template.pipe';
import { EventSearcherComponent } from './components/forms/event-searcher/event-searcher.component';
import { SearchByTextPipe } from './pipes/search-by-text.pipe';
import { UserProjectSelectorComponent } from './components/forms/user-project-selector/user-project-selector.component';
import { UserRoleSelectorComponent } from './components/forms/user-role-selector/user-role-selector.component';

const routes: Array<Route> = [
  { path: '', component: UserListComponent },
  { path: 'research', component: ResearchListComponent },
  { path: 'edit-permissions', component: PermissionWizardComponent },
  { path: 'edit-user', component: UserWizardComponent },
]

@NgModule({
  declarations: [UserListComponent, UserDetailsComponent, ResearchListComponent, PermissionWizardComponent, FooterComponent, HeaderComponent, TabsComponent, Step1Component, Step2Component, Step3Component, RuleItemComponent, UserWizardComponent, EditUserGeneralComponent, EditPermissionSetComponent, UserNameSelectorComponent, InputItemComponent, DistinctTemplatePipe, EventSearcherComponent, SearchByTextPipe, UserProjectSelectorComponent, UserRoleSelectorComponent],
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
