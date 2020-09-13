import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientStoryService } from '@app/patient/services/patient-story.service';
import { ConfigService } from '@app/shared/services/config.service';
import { BaseSibscriber, EmptyState, NavigationService, NotificationsService, PageInfo, TableComponent, TableModel } from '@appcore';


@Component({
  selector: 'md-patient-story',
  templateUrl: './patient-story.component.html',
  styleUrls: ['./patient-story.component.scss']
})
export class PatientStoryComponent extends BaseSibscriber implements OnInit {

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
