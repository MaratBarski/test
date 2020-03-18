import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModel, MenuLink, PopupComponent, TableComponent, SwitchButtonModel } from '../../../core-api';

@Component({
  selector: 'md-my-queries',
  templateUrl: './my-queries.component.html',
  styleUrls: ['./my-queries.component.scss']
})
export class MyQueriesComponent implements OnInit {

  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;
  @ViewChild('table', { static: true }) table: TableComponent;

  isMainExpanded = true;
  isSharedExpanded = true;
  isMyApprovalExpanded = true;
  data: TableModel;
  dataSource: TableModel;

  constructor() { }

  ngOnInit() {
    this.initData();
  }

  switchButtons: Array<SwitchButtonModel> = [
    {
      disable: false,
      icon: 'ic-numeric'
    },
    {
      disable: false,
      icon: 'ic-textual'
    },
    {
      disable: true,
      icon: 'ic-calendar'
    }
  ]
  switchBtnClick(index: number): void {
    console.log(index);
  }

  suggestions = [];
  _suggestions = [
    { name: 'test1' },
    { name: 'test2' },
    { name: 'test3' },
    { name: 'test4' },
    { name: 'test5' },
    { name: 'test6' },
    { name: 'test7' },
    { name: 'test12' },
    { name: 'test13' },
    { name: 'test14' },
    { name: 'test15' },
    { name: 'test5' },
    { name: 'test6' },
    { name: 'test7' },
    { name: 'test8' },
    { name: 'test9' },
    { name: 'value1' },
    { name: 'value2' },
    { name: 'value3' },
    { name: 'value4' },
    { name: 'value5' },
  ]
  completeMethod(text: string): void {
    this.suggestions = this._suggestions.filter(x => x.name.startsWith(text));
  }
  selectedItem: any;
  selectItem(item: any): void {
    this.selectedItem = item;
  }

  searchQueryComplete(text: string): void {
    console.log(text);
  }

  searchSharedQueryComplete(text: string): void {
    console.log(text);
  }

  addQuery(): void {
    console.log('Add query');
  }

  editLink: MenuLink = {
    text: 'Edit',
    icon: 'ic-edit',
    click: (source) => { console.log(JSON.stringify(source)); }
  }

  duplicateLink: MenuLink = {
    text: 'Duplicate',
    icon: 'ic-duplicate',
    click: (source) => { console.log(JSON.stringify(source)); }
  }

  downloadLink: MenuLink = {
    text: 'Download',
    icon: 'ic-download',
    disable: true,
    click: (source) => { console.log(JSON.stringify(source)); }
  }

  sharelink: MenuLink = {
    text: 'Share',
    icon: 'ic-share',
    click: (source) => {
      console.log(JSON.stringify(source));
    }
  }

  qualitylink: MenuLink = {
    text: 'Quality Of Care',
    icon: 'ic-quality',
    disable: true,
    click: (source) => {
      console.log(JSON.stringify(source));
    }
  }

  sendlink: MenuLink = {
    text: 'Send',
    icon: 'ic-send',
    click: (source) => {
      console.log(JSON.stringify(source));
    }
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
  }

  links: Array<MenuLink> = [
    this.editLink,
    this.duplicateLink,
    this.downloadLink,
    this.sharelink,
    this.qualitylink,
    this.sendlink
  ];
  sublinks: Array<MenuLink> = [this.deleteLink];

  cellClick(item: any, event: any): void {
    this.editLink.source = item;
    this.sharelink.source = item;
    this.deleteLink.source = item;
    this.popupMenu.target = event.target;
    this.popupMenu.show(true, event);
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
