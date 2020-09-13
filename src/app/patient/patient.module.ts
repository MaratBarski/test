import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@appcore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { Route, RouterModule } from '@angular/router';
import { PatientStoryComponent } from './pages/patient-story/patient-story.component';
import { EditPatientStoryWizardComponent } from './pages/edit-patient-story-wizard/edit-patient-story-wizard.component';
import { Step1Component } from './components/steps/step1/step1.component';
import { Step2Component } from './components/steps/step2/step2.component';
import { Step3Component } from './components/steps/step3/step3.component';
import { Step4Component } from './components/steps/step4/step4.component';
import { HeaderComponent } from './components/header/header.component';

const routes: Array<Route> = [
  { path: '', component: PatientStoryComponent },
  { path: 'edit', component: EditPatientStoryWizardComponent }
]

@NgModule({
  declarations: [
    PatientStoryComponent,
    EditPatientStoryWizardComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})

export class PatientModule { }

