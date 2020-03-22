import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TableComponent, TranslateService, DateService, TabItemModel, TableModel, MenuLink, PopupComponent } from 'appcore';
import { HistoryReportService } from '../../services/history-repost.service';
import { Store } from '@ngrx/store';
import { load } from '../../store/actions/history-report.actions';
import { TableHeaderModel, CheckBoxListOption, NavigationService, PageInfo, BaseSibscriber } from 'projects/core/src/public-api';
import { CheckBoxListComponent } from 'core/public-api';
import { selectFHistoryReport } from '@app/history-report/store/selectors/history-report.selector';

@Component({
  selector: 'md-output-history-report',
  templateUrl: './output-history-report.component.html',
  styleUrls: ['./output-history-report.component.scss']
})


export class OutputHistoryReportComponent extends BaseSibscriber implements OnInit, OnDestroy {

  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;
  @ViewChild('popupFilter', { static: true }) popupFilter: PopupComponent;
  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('checkFilter', { static: true }) checkFilter: CheckBoxListComponent;

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    private historyReportService: HistoryReportService,
    private store: Store<any>,
    private navigationService: NavigationService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.MonitorReports.id;
  }

  deleteLink: MenuLink = {
    text: 'Delete',
    disable: false,
    icon: 'ic-delete',
    source: 'test',
    click: (source) => {
    }
  }

  editLink: MenuLink = {
    text: 'Edit File Settings',
    icon: 'ic-edit',
    click: (source) => { console.log(JSON.stringify(source)); }
  }

  viewLink: MenuLink = {
    text: 'View output summary',
    icon: 'ic-view',
    click: (source) => { console.log(JSON.stringify(source)); }
  }

  sublinks: Array<MenuLink> = [this.deleteLink];
  links: Array<MenuLink> = [
    this.editLink,
    this.viewLink
  ];

  tabs: Array<TabItemModel>;
  tabActive = 0;
  serachText = '';
  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;
  reports: Array<any>;

  searchComplete(text: string): void {
    //this.table.resetPaginator();
    //this.serachText = text;
  }

  selectTab(tab: number): void {
    this.tabActive = tab;
    this.createDataSource();
  }

  editClick(item: any, source: any, event: any): void {
    this.deleteLink.source = source;
    this.editLink.source = source;
    this.viewLink.source = source;
    this.popupMenu.target = event.target;
    this.popupMenu.show(true, event);
  }

  ngOnInit() {
    this.initTabs();
    super.add(
      this.store.select(selectFHistoryReport).subscribe((reports: Array<any>) => {
      }));

    this.store.dispatch(load());
  }


  initTabs(): void {
    this.tabs = [
      { title: this.translateService.translate('All') },
      { title: 'Last 30 Days' },
      { title: 'Last 7 Days' },
      { title: 'Specific' },
    ];
  }

  cellClick(item: any): void { }

  users: Array<CheckBoxListOption> = [];
  projects: Array<CheckBoxListOption> = [];
  filterOptions: Array<CheckBoxListOption> = [];
  curentFilter: string;


  createDataSource(): void {
  }

  searchOptions = [];

}

