import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent, CheckBoxListComponent, DownloadComponent, CheckBoxListOption, EmptyState, TableModel, BaseSibscriber, TableActionCommand } from '@appcore';
import { ResearchService } from '@app/users/services/research.service';
import { ConfigService } from '@app/shared/services/config.service';
import { UserEditService } from '@app/users/services/user-edit.service';

@Component({
  selector: 'md-edit-permission-set',
  templateUrl: './edit-permission-set.component.html',
  styleUrls: ['./edit-permission-set.component.scss']
})
export class EditPermissionSetComponent extends BaseSibscriber implements OnInit {

  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('checkFilter', { static: true }) checkFilter: CheckBoxListComponent;
  @ViewChild('downloader', { static: true }) downloader: DownloadComponent;

  permissions: Array<CheckBoxListOption> = [];
  searchOptions = ['PermissionSetName', 'User', 'Modified', 'Environment', 'ApprovalKey'];

  emptyState: EmptyState = {
    title: 'No permission set exists yet. Start by clicking on the button above.',
    subTitle: 'The sets will be listed here.',
    image: 'output-history-2-x.png'
  }

  isDataExists = true;
  isLoaded = false;

  dataOrigin: TableModel;
  dataSource: TableModel;
  onComplete: any;
  downloadFileName = 'research.csv';

  constructor(
    private researchService: ResearchService,
    public configService: ConfigService,
    public userEditService: UserEditService
  ) {
    super();
  }

  private initData(): void {
    this.isDataExists = !!(this.userEditService.user.permissionSets && this.userEditService.user.permissionSets.length);
    this.dataOrigin = this.dataSource = this.userEditService.getSetTable();
    this.isLoaded = true;
  }

  onAction(action: TableActionCommand): void {
    this.execCommand[action.command](action);
  }

  execCommand = {
    edit: (action: TableActionCommand) => {
      //this.router.navigateByUrl(`/imported-files/${action.item.source.fileId}`);
      console.log('edit command');
    },
    delete: (action: TableActionCommand) => {
      this.userEditService.removeSet(action.item.source);
      this.initData();

    }
  };

  ngOnInit() {
    this.isLoaded = false;
    this.initData();
    //this.table.stayOnCurrentPage = true;
  }

  isActive(src: any): boolean {
    return this.researchService.isActive(src, true, false);
  }

  isCreateNewSet = false;

  createSet(): void {
    this.isCreateNewSet = true;
  }

  closeCreateSet(): void {
    this.isCreateNewSet = false;
  }

  addPermissinSet(ps: any): void {
    if (!ps) { return; }
    this.userEditService.addSet(ps);
    this.isCreateNewSet = false;
    this.initData();
  }
}
