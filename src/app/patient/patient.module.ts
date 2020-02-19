import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { DemographyComponent } from './demography/demography.component';
import { Routes, RouterModule } from '@angular/router';

const routers: Routes = [
  { path: 'patient', component: PatientInfoComponent },
  { path: 'demography', component: DemographyComponent },
  { path: '', redirectTo: 'patient', pathMatch: 'full' }
]

@NgModule({
  declarations: [PatientInfoComponent, DemographyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routers)
  ]
})
export class PatientModule { }
