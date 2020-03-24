import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HistoryReportService } from '../../services/history-repost.service';
import { Store } from '@ngrx/store';
import { load } from '../../store/actions/history-report.actions';
import { TableComponent, TranslateService, DateService, TabItemModel, TableModel, MenuLink, PopupComponent, FromTo, CheckBoxListOption, NavigationService, PageInfo, BaseSibscriber, CheckBoxListComponent, ComponentService, ModalWindowComponent } from '@app/core-api';
import { selectFHistoryReport, selectFHistoryReportData } from '@app/history-report/store/selectors/history-report.selector';
import { HistoryInfoComponent } from '@app/history-report/components/history-info/history-info.component';

@Component({
  selector: 'md-output-history-report',
  templateUrl: './output-history-report.component.html',
  styleUrls: ['./output-history-report.component.scss']
})


export class OutputHistoryReportComponent extends BaseSibscriber implements OnInit, OnDestroy {

  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;
  @ViewChild('popupFilter', { static: true }) popupFilter: PopupComponent;
  @ViewChild('dateRangeSelector', { static: true }) dateRangeSelector: PopupComponent;
  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('checkFilter', { static: true }) checkFilter: CheckBoxListComponent;
  @ViewChild('historyInfoModal', { static: true }) historyInfoModal: ModalWindowComponent;
  @ViewChild('historyionInfo', { static: true }) historyionInfo: HistoryInfoComponent;

  customTo = new Date();
  customFrom = new Date();

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

  tabs: Array<TabItemModel> = [
    { title: this.translateService.translate('All') },
    { title: 'Last 30 Days' },
    { title: 'Last 7 Days' }
    , {
      title: this.translateService.translate('Specific'), isDropDown: true,
      mouseOver: (index: number, tab: TabItemModel, event: any, target: any) => {
        if (this.dateRangeSelector.isExpanded) { return; }
        this.dateRangeSelector.target = target;
        this.dateRangeSelector.show(true, event);
      }
    }
  ];

  showHistoryInfo = false;
  tabActive = 0;
  serachText = '';
  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;
  reports: Array<any>;
  selectedCategory: any;

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
    super.add(
      this.store.select(selectFHistoryReportData).subscribe((reports: Array<any>) => {
        this.reports = reports;
        this.dataOrigin = this.dataSource = this.historyReportService.createDataSource(this.reports);
      }));

    this.store.dispatch(load());
  }


  cellClick(item: any): void { }

  users: Array<CheckBoxListOption> = [];
  projects: Array<CheckBoxListOption> = [];
  filterOptions: Array<CheckBoxListOption> = [];
  curentFilter: string;


  createDataSource(): void {
  }

  searchOptions = [];

  cancelCustomDate(): void {
    this.dateRangeSelector.isExpanded = false;
  }

  applyCustomDate(range: FromTo): void {
    this.tabActive = this.tabs.length - 1;
    this.dateRangeSelector.isExpanded = false;
    this.customFrom = range.from;
    this.customTo = range.to;
    this.createDataSource();
  }
  
  openHistoryInfo(category: any, event: any): void {
    this.historyInfoModal.top = `${event.clientY + ComponentService.scrollTop()}px`;
    this.historyionInfo.isOver = true;
    
    this.selectedCategory = category;
    this.showHistoryInfo = true;
    setTimeout(() => {
      this.historyionInfo.isOver = false;
    }, 100);
  }

  closeHistoryInfo():void{
    this.showHistoryInfo = false;
  }
}

