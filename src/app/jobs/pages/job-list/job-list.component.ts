import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '@app/jobs/services/job.service';
import { ConfigService } from '@app/shared/services/config.service';
import { BaseSibscriber, EmptyState, NavigationService, NotificationsService, PageInfo, TableActionCommand, TableComponent, TableModel, ToasterType } from '@appcore';
import { take } from 'rxjs/operators';

@Component({
  selector: 'md-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})

export class JobListComponent extends BaseSibscriber implements OnInit {

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
    public jobService: JobService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.Job.id;
  }

  ngOnInit(): void {
    this.load();
  }


  private initData(): void {
    this.isDataExists = !!(this.fileSource && this.fileSource.length);
    this.dataOrigin = this.dataSource = this.jobService.createDataSource(this.fileSource);
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
      this.jobService.abort(action.item)
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
              containerEnable: false,
              displayPeriod: 4
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
        this.jobService.deletePatientStory(this.currentItemForDelete.source)
          .subscribe(() => {
            this.notificationsService.addNotification({
              showInToaster: true,
              name: 'Patient story successfully.',
              comment: 'Patient story is deleted.',
              type: ToasterType.success,
              isClientOnly: true,
              displayPeriod: 4
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
              isClientOnly: true,
              displayPeriod: 4
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
      this.jobService.load().subscribe((res: any) => {
        this.fileSource = res.data && res.data.result ? res.data.result : [];
        this.initData();
      }));
    this.onComplete = (): void => {
      super.add(
        this.jobService.load().subscribe((res: any) => {
          this.fileSource = res.data || [];
          this.initData();
          this.table.stayOnCurrentPage = true;
        }));
    }
  }

  addNewJob(): void {
    this.router.navigateByUrl("/job/edit");
  }

}
