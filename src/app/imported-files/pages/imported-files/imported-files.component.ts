import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent, TranslateService, DateService, TabItemModel, TableModel } from '../../../core-api';
import { ImportedFilesService } from '../../services/imported-files.service';
import { Store } from '@ngrx/store';
import { load } from '../../store/actions/imported-files.actions';
import { selectData } from '../../store/selectors/imported-files.selector';

@Component({
  selector: 'md-imported-files',
  templateUrl: './imported-files.component.html',
  styleUrls: ['./imported-files.component.scss']
})
export class ImportedFilesComponent implements OnInit {

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
  fileSource : any;

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

  ngOnInit() {
    this.initTabs();
    this.initData();
    this.fileSource = this.store.select(selectData);
    this.store.dispatch(load());
    //this.importedFilesService.load();
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

  searchOptions = ['Name', 'User', 'Loaded', 'No'];
  initData(): void {
    this.data = {
      headers: [{
        columnId: 'No',
        text: 'No',
        isSortEnabled: true,
        sortDir: 'desc',
        isSortedColumn: true
      },
      {
        columnId: 'Name',
        text: 'Name',
        isSortEnabled: true
      },
      {
        columnId: 'Loaded',
        text: 'Loaded',
        isSortEnabled: true
      },
      {
        columnId: 'Environment',
        text: 'Environment',
        isSortEnabled: true
      },
      {
        columnId: 'Template',
        text: 'Template',
        isSortEnabled: true
      },
      {
        columnId: 'User',
        text: 'User',
        isSortEnabled: true
      }
      ],
      rows: [
        {
          cells:
          {
            Name: 'StrokeSmall.csv',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Test'
          }
          ,
          isActive: true
        },
        {
          cells:
          {
            Name: 'StrokeSmall.csv',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        },
        {
          cells:
          {
            Name: 'test sdfag ag fg sdfg fgsdfgsd test sdfag ag fg sdfg fgsdfgsd test sdfag ag fg sdfg fgsdfgsd test sdfag ag fg sdfg fgsdfgsd test sdfag ag fg sdfg fgsdfgsd test sdfag ag fg sdfg fgsdfgsd test sdfag ag fg sdfg fgsdfgsd ',
            Loaded: 'Jan 20, 2020',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: 'Nov 12, 2019',
            Environment: 'Demo Project',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        }, {
          cells:
          {
            Name: 'test',
            Loaded: new Date(),
            Environment: '1111111111',
            Template: 'Demo Template',
            User: 'Noa'
          }
          ,
          isActive: true
        },
      ]
    }
    this.data.rows.forEach((r, i) => {
      r.cells['No'] = i;
    });
    this.dataSource = this.data;
  }

}
