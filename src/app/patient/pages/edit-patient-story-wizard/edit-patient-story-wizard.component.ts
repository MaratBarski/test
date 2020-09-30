import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPatientService } from '@app/patient/services/edit-patient.service';
import { TabWizardItem } from '@app/shared/components/tab-wizard/tab-wizard.component';
import { BaseNavigation, BaseSibscriber, NavigationService } from '@appcore';

@Component({
  selector: 'md-edit-patient-story-wizard',
  templateUrl: './edit-patient-story-wizard.component.html',
  styleUrls: ['./edit-patient-story-wizard.component.scss']
})
export class EditPatientStoryWizardComponent extends BaseNavigation implements OnInit {

  constructor(
    public editPatientService: EditPatientService,
    private activatedRoute: ActivatedRoute,
    protected navigationService: NavigationService,
    private router: Router
  ) {
    super(navigationService);
  }

  showLegend = true;
  pageTitle = 'ADD PATIENT STORY SETTINGS';

  tabs: Array<TabWizardItem> = [
    {
      text: 'Source & Output'
    },
    {
      text: 'Content',
      isOptional: true
    },
    {
      text: 'Privacy Settings',
      isOptional: true
    },
    {
      text: 'Summary'
    }
  ];

  ngOnInit(): void {
    this.navigationService.beforeNavigate = ((url: string) => {
      if (url) {
        this.editPatientService.redirectUrl = url;
      }
      if (this.editPatientService.isValueChanged) {
        this.editPatientService.showCancelConfirm = !!url;
        return true;
      }
      if (url) {
        this.router.navigateByUrl(url);
      }
    });
    super.add(
      this.activatedRoute.paramMap.subscribe(u => {
        const id = parseInt(u.get('id') || '0');
        this.pageTitle = id ? 'EDIT PATIENT STORY SETTINGS' : 'ADD PATIENT STORY SETTINGS';
        this.editPatientService.reset(id);
      }));
  }

  selectNextTab(index: number): void {
    this.editPatientService.setTab(index);
  }

  onCancel(): void {
    this.navigationService.navigate('/patient');
  }

  onSave(): void {
    this.editPatientService.save();
  }

  onNext(i: number): void {
    this.editPatientService.setNextTab(i);
  }

  get showChangesConfirm(): boolean {
    return this.editPatientService.showCancelConfirm;
  }

  cancelChanges(): void {
    this.editPatientService.showCancelConfirm = false;
  }

  confirmChanges(): void {
    this.editPatientService.cancelConfirm();
  }
}
