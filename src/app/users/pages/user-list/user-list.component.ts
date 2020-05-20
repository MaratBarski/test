import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService, NavigationService, PageInfo, BaseSibscriber, TableActionCommand, EmptyState, SelectOption, TableModel, TableComponent } from '@appcore';
import { Router } from '@angular/router';
import { UserListService } from '@app/users/services/user-list.service';
import { UserDetailsComponent } from '@app/users/components/user-details/user-details.component';


@Component({
  selector: 'md-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends BaseSibscriber implements OnInit {

  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('userDetails', { static: true }) userDetails: UserDetailsComponent;
  
  searchOptions = ['fullName', 'userName', 'email', 'specialRoles'];
  isLoaded = true;
  isDataExists = true;

  dataOrigin: TableModel;
  dataSource: TableModel;
  userList: Array<any>;

  emptyState: EmptyState = {
    title: 'You can synthesize or manipulate your own data. Start by clicking the button above.',
    subTitle: 'The users will be listed here.',
    image: 'filesEmpty.png'
  }

  currentEnvitonment = '';
  selectedEnvironment: SelectOption;
  environmens: Array<SelectOption>;

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private loginService: LoginService,
    private userListService: UserListService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.ManageUsers.id;
  }

  addUserOpen(): void {
  }

  onAction(action: TableActionCommand): void {
    this.execCommand[action.command](action);
  }

  execCommand = {
    edit: (action: TableActionCommand) => {
      this.router.navigateByUrl(`/imported-files/${action.item.source.fileId}`);
      console.log('edit command');
    },
    view: (action: TableActionCommand) => {
      console.log('view command');
    },
    delete: (action: TableActionCommand) => {
    }
  };

  private initData(): void {
    this.isDataExists = !!(this.userList && this.userList.length);
    this.dataOrigin = this.dataSource = this.userListService.createDataSource(this.userList);
    this.isLoaded = true;
  }

  ngOnInit(): void {
    super.add(
      this.loginService.onUserInfoUpdated.subscribe(ui => {
        if (!ui || !ui.data || !ui.data.projects) { return; }
        this.environmens = [{ id: '0', text: 'All Environment', value: '0' }].concat(ui.data.projects.map(x => {
          return { text: x.projectName, id: x.projectId, value: x };
        }) as any);
        if (!this.selectedEnvironment) {
          this.selectedEnvironment = this.environmens.length ? this.environmens[0] : undefined;
        }
      }));

    super.add(
      this.userListService.load().subscribe((res: any) => {
        this.userList = res.data || [];
        this.initData();
      }));
  }

  changeEnvironment(option: SelectOption): void {
    this.currentEnvitonment = (option.id as string);
  }

  closeUserDetailes(): void {
    this.table.closeRowInfo();
  }

}
