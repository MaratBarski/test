import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HistoryReportService } from '../../services/history-repost.service';
import { TableComponent, TranslateService, DateService, TabItemModel, TableModel, MenuLink, PopupComponent, FromTo, CheckBoxListOption, NavigationService, PageInfo, BaseSibscriber, CheckBoxListComponent, ComponentService, ModalWindowComponent } from '@app/core-api';
import { HistoryInfoComponent } from '@app/history-report/components/history-info/history-info.component';
import { SessionHistory } from '@app/models/session-history';
import { environment } from '@env/environment';


@Component({
  selector: 'md-output-history-report',
  templateUrl: './output-history-report.component.html',
  styleUrls: ['./output-history-report.component.scss']
})


export class OutputHistoryReportComponent extends BaseSibscriber implements OnInit, OnDestroy {

  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;
  
  @ViewChild('dateRangeSelector', { static: true }) dateRangeSelector: PopupComponent;
  @ViewChild('table', { static: true }) table: TableComponent;
 
  @ViewChild('historyInfoModal', { static: true }) historyInfoModal: ModalWindowComponent;
  @ViewChild('historyionInfo', { static: true }) historyionInfo: HistoryInfoComponent;

  customTo = new Date();
  customFrom = new Date();
  downloadFileName = 'history.csv';

  get downloadUrl():string{ return environment.serverUrl + environment.endPoints.downloadHistoryReport + '/' };

  constructor(
    private translateService: TranslateService,
    private historyReportService: HistoryReportService,
    private navigationService: NavigationService,
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.MonitorReports.id;
  }

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

  searchComplete(text: string): void {}

  selectTab(tab: number): void {
    this.tabActive = tab;
    this.createDataSource();
  }

 
  ngOnInit() {
    super.add(
      this.historyReportService.load().subscribe((res: any) => {
        this.reports = res.data;
        this.dataOrigin = this.dataSource = this.historyReportService.createDataSource(this.reports);
      }));
  }

  downloadClick(item: SessionHistory, source: SessionHistory, event: any): void {
    console.log(source);
    console.log(item);
  }

  cellClick(item: any): void { }

  createDataSource(): void {
  }

  searchOptions = ['source', 'fullName', 'environment', 'source'];

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

  closeHistoryInfo(): void {
    this.showHistoryInfo = false;
  }
  
}

