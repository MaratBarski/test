import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientStoryService } from '@app/patient/services/patient-story.service';
import { ConfigService } from '@app/shared/services/config.service';
import { BaseSibscriber, EmptyState, NavigationService, NotificationsService, PageInfo, TableActionCommand, TableComponent, TableModel, ToasterType } from '@appcore';
import { take } from 'rxjs/operators';


@Component({
  selector: 'md-patient-story',
  templateUrl: './patient-story.component.html',
  styleUrls: ['./patient-story.component.scss']
})
export class PatientStoryComponent extends BaseSibscriber implements OnInit {

  searchOptions = ['SettingsName'];
  emptyState: EmptyState = {
    title: 'No settings defined yet. Start by clicking the button above.',
    subTitle: 'The patient story settings will be listed here.',
    image: 'empty.png'
  }

  @ViewChild('table', { static: true }) table: TableComponent;

  dataOrigin: TableModel;
  dataSource: TableModel;
  fileSource: Array<any>;
  onComplete: any;
  isDataExists = true;
  isLoaded = false;

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public configService: ConfigService,
    private notificationsService: NotificationsService,
    public patientStoryService: PatientStoryService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.Patient.id;
  }

  ngOnInit(): void {
    this.load();
  }


  private initData(): void {
    this.isDataExists = !!(this.fileSource && this.fileSource.length);
    this.dataOrigin = this.dataSource = this.patientStoryService.createDataSource(this.fileSource);
    this.isLoaded = true;
  }

  onAction(action: TableActionCommand): void {
    this.execCommand[action.command](action);
  }

  showDeleteConfirm = false;
  currentItemForDelete: any;
  deleteSubTitle = '';

  execCommand = {
    edit: (action: TableActionCommand) => {
      this.isLoaded = false;
      this.router.navigate(['/patient/edit', { id: action.item.source.lifeFluxTransId }]);
    },
    dublicate: (action: TableActionCommand) => {
      this.isLoaded = false;
      this.router.navigate(['/patient/edit', { id: action.item.source.lifeFluxTransId, copy: 1 }]);
    },
    download: (action: TableActionCommand) => {
    },
    abort: (action: TableActionCommand) => {
      this.patientStoryService.abort(action.item)
        .pipe(take(1))
        .subscribe(res => {
          action.item.source.transStatus = 'aborted';
        }, error => {
          this.notificationsService.addNotification(
            {
              type: ToasterType.error,
              name: 'Failed to abort',
              comment: action.item.source.name,
              showInToaster: true,
              containerEnable: false
            }
          )
        });
    },
    delete: (action: TableActionCommand) => {
      this.showDeleteConfirm = true;
      this.currentItemForDelete = action.item;
      this.deleteSubTitle = `This action will delete the patient story '${this.currentItemForDelete.source.name}'.`;
    },
  };

  confirmDelete(): void {
    if (!this.currentItemForDelete) { return; }
    this.showDeleteConfirm = false;
    this.currentItemForDelete.isInactive = true;
    const tempItem = this.currentItemForDelete;
    setTimeout(() => {
      super.add(
        this.patientStoryService.deletePatientStory(this.currentItemForDelete.source)
          .subscribe(() => {
            this.notificationsService.addNotification({
              showInToaster: true,
              name: 'Categorization deleted successfully.',
              comment: 'The categorization is deleted.',
              type: ToasterType.success,
              isClientOnly: true
            });
            this.fileSource = this.fileSource.filter(x => x != tempItem.source);
            this.initData();
            this.table.stayOnCurrentPage = true;
          }, error => {
            tempItem.isInactive = false;
            this.notificationsService.addNotification({
              showInToaster: true,
              name: 'Patient story cannot be deleted.',
              comment: '',
              type: ToasterType.error,
              isClientOnly: true
            });
          })
      )
    }, 1);

  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  private load(): void {
    this.isLoaded = false;
    super.add(
      this.patientStoryService.load().subscribe((res: any) => {
        this.fileSource = res.data || [];
        this.initData();
      }));
    this.onComplete = (): void => {
      super.add(
        this.patientStoryService.load().subscribe((res: any) => {
          this.fileSource = res.data || [];
          this.initData();
          this.table.stayOnCurrentPage = true;
        }));
    }
  }

  openFileUpload(): void {
    this.router.navigateByUrl("/patient/edit");
  }

}
