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
import { EventPropertyListComponent } from './components/event-property-list/event-property-list.component';
import { Step31Component } from './components/Step3Items/step31/step31.component';
import { Step32Component } from './components/Step3Items/step32/step32.component';
import { Step33Component } from './components/Step3Items/step33/step33.component';
import { Step34Component } from './components/Step3Items/step34/step34.component';
import { Step3HeaderComponent } from './components/Step3Items/step3-header/step3-header.component';
import { Summary1Component } from './components/summary/summary1/summary1.component';
import { Summary2Component } from './components/summary/summary2/summary2.component';
import { Summary3Component } from './components/summary/summary3/summary3.component';
import { SummaryHeaderComponent } from './components/summary/summary-header/summary-header.component';
import { HierarchyOptionsPipe } from './pipes/hierarchy-options.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { CheckedPipe } from './pipes/checked.pipe';

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
    HeaderComponent,
    EventPropertyListComponent,
    Step31Component,
    Step32Component,
    Step33Component,
    Step34Component,
    Step3HeaderComponent,
    Summary1Component,
    Summary2Component,
    Summary3Component,
    SummaryHeaderComponent,
    HierarchyOptionsPipe,
    FooterComponent,
    CheckedPipe
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

