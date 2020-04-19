import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {TableComponent, TranslateService, DateService, TabItemModel, TableModel, MenuLink, PopupComponent, SelectOption} from '@appcore';
import {ImportedFilesService} from '../../services/imported-files.service';
import {Store} from '@ngrx/store';
import {load} from '../../store/actions/imported-files.actions';
import {selectData} from '../../store/selectors/imported-files.selector';
import {FileClm, FileSource} from '../../models/file-source';
import {Subscription} from 'rxjs';
import {UploadService} from '@app/shared/services/upload.service';
import {ActivatedRoute} from '@angular/router';
import {Template} from '@app/models/template';

@Component({
  selector: 'md-imported-files-mapping',
  templateUrl: './imported-files-mapping.component.html',
  styleUrls: ['./imported-files-mapping.component.scss']
})
export class ImportedFileMappingComponent implements OnInit, OnDestroy {
  fileSource: FileSource;
  templates: Template[] = [];
  templateSelectOptions: SelectOption[] = [];
  @ViewChild('popupMenu', {static: true}) popupMenu: PopupComponent;
  @ViewChild('table', {static: true}) table: TableComponent;

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    private importedFilesService: ImportedFilesService,
    private store: Store<any>,
    private route: ActivatedRoute
  ) {
    this.fileSource = this.route.snapshot.data.data[0];
    this.templates = this.route.snapshot.data.data[1];
    this.templates.forEach(item => {
      const tmp: SelectOption = new SelectOption();
      tmp.id = item.templateId;
      tmp.text = item.templateName;
      this.templateSelectOptions.push(tmp);
    });


    console.log(this.fileSource);
    console.log(this.templates);
  }

  deleteLink: MenuLink = {
    text: 'Delete',
    disable: false,
    icon: 'ic-delete',
    source: 'test',
    click: (source) => {
      this.dataSource = {
        ...this.dataSource, ...{
          rows: this.dataSource.rows.filter(r => r.cells.No !== source.No)
        }
      };
    }
  };

  editLink: MenuLink = {
    text: 'Edit',
    icon: 'ic-edit',
    click: (source) => {
      console.log(JSON.stringify(source));
    }
  };

  viewLink: MenuLink = {
    text: 'View output summary',
    icon: 'ic-view',
    click: (source) => {
      console.log(JSON.stringify(source));
    }
  };

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
  subscriptions: Array<Subscription> = [];

  searchComplete(text: string): void {
    //this.table.resetPaginator();
    //this.serachText = text;
  }

  selectTab(tab: number): void {
    this.tabActive = tab;
    let rows = this.dataOrigin.rows;
    if (this.tabActive === 1) {
      rows = this.dateService.lastMonth(rows, 'insertDate');
    } else if (this.tabActive === 2) {
      rows = this.dateService.lastWeek(rows, 'insertDate');
    }
    this.dataSource = {...this.dataOrigin, rows: rows};
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  editClick(item: any, event: any): void {
    this.deleteLink.source = item;
    this.editLink.source = item;
    this.viewLink.source = item;
    this.popupMenu.target = event.target;
    this.popupMenu.show(true, event);
  }

  ngOnInit() {

    this.initTabs();
    this.subscriptions.push(
      this.store.select(selectData).subscribe((files: Array<FileSource>) => {
        this.dataOrigin = this.dataSource = this.importedFilesService.createDataSource(files);
      }));

    this.store.dispatch(load());
  }

  initTabs(): void {
    this.tabs = [
      {title: this.translateService.translate('All')},
      {title: this.translateService.translate('LastMonth')},
      {title: this.translateService.translate('LastWeek')}
    ];
  }

  cellClick(item: any): void {
    alert(JSON.stringify(item));
  }

  searchOptions = ['fileName'];

}
