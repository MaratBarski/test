import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TableComponent, TranslateService, DateService, TabItemModel, TableModel } from '../../../core-api';
import { ImportedFilesService } from '../../services/imported-files.service';
import { Store } from '@ngrx/store';
import { load } from '../../store/actions/imported-files.actions';
import { selectData } from '../../store/selectors/imported-files.selector';
import { FileSource } from '../../models/file-source';
import { Subscription } from 'rxjs';

@Component({
  selector: 'md-imported-files',
  templateUrl: './imported-files.component.html',
  styleUrls: ['./imported-files.component.scss']
})
export class ImportedFilesComponent implements OnInit, OnDestroy {

  @ViewChild('table', { static: true }) table: TableComponent;
  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    private importedFilesService: ImportedFilesService,
    private store: Store<any>
  ) { }

  tabs: Array<TabItemModel>;
  tabActive = 0;
  serachText = '';
  data: TableModel;
  showUploadFile = false;
  dataSource: TableModel;
  subscriptions: Array<Subscription> = [];

  searchComplite(text: string): void {
    //this.table.resetPaginator();
    //this.serachText = text;
  }

  selectTab(tab: number): void {
    this.tabActive = tab;
    let rows = this.data.rows;
    if (this.tabActive === 1) {
      rows = this.dateService.lastMonth(rows, 'Loaded');
    } else if (this.tabActive === 2) {
      rows = this.dateService.lastWeek(rows, 'Loaded');
    }
    this.dataSource = { ...this.data, rows: rows };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    this.initTabs();
    this.subscriptions.push(
      this.store.select(selectData).subscribe((files: Array<FileSource>) => {
        this.dataSource = this.importedFilesService.createDataSource(files);
      }));

    this.store.dispatch(load());
  }

  initTabs(): void {
    this.tabs = [
      { title: this.translateService.translate('All') },
      { title: this.translateService.translate('LastMonth') },
      { title: this.translateService.translate('LastWeek') }
    ];
  }

  cellClick(item: any): void {
    alert(JSON.stringify(item));
  }

  searchOptions = ['fileName'];

}
