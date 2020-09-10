import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent, CheckBoxListComponent, DownloadComponent, CheckBoxListOption, EmptyState, TableModel, BaseSibscriber, TableActionCommand } from '@appcore';
import { ResearchService } from '@app/users/services/research.service';
import { ConfigService } from '@app/shared/services/config.service';
import { UserEditService } from '@app/users/services/user-edit.service';
import { PermissionWizardComponent } from '@app/users/pages/permission-wizard/permission-wizard.component';
import { PermissionSetService } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-edit-permission-set',
  templateUrl: './edit-permission-set.component.html',
  styleUrls: ['./edit-permission-set.component.scss']
})
export class EditPermissionSetComponent extends BaseSibscriber implements OnInit {

  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('checkFilter', { static: true }) checkFilter: CheckBoxListComponent;
  @ViewChild('downloader', { static: true }) downloader: DownloadComponent;
  @ViewChild('permissionWizard', { static: false }) permissionWizard: PermissionWizardComponent;

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
    public userEditService: UserEditService,
    public permissionSetService: PermissionSetService
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

  currentSet: any;
  isSetLoading = false;
  
  updateSetOffline(pw: PermissionWizardComponent): void {
    if (this.currentSet) {
      pw.setOffline({ ...this.currentSet.ps });
    }
  }

  execCommand = {
    edit: (action: TableActionCommand) => {
      this.currentSet = action.item.source;
      if (this.currentSet.ps.isFromServer) {
        this.isSetLoading = true;
        const subscribtion = this.permissionSetService.getSetById(this.currentSet.ps.researchId).subscribe(res => {
          subscribtion.unsubscribe();
          this.isSetLoading = false;
          this.currentSet.ps = this.permissionSetService.convertToClient(res.data);

          this.currentSet.ps.projectName = res.data.project ? res.data.project.projectName : '';
          this.currentSet.ps.allowedEvent = this.userEditService.getAllowedEvent(res.data);
          this.currentSet.ps.researchTemplates = res.data.researchTemplates ? res.data.researchTemplates.map(t => {
            return {
              templateId: t.templateId
            }
          }) : [];
          this.currentSet.ps.researchRestrictionEvents = res.data.researchRestrictionEvents ?
            res.data.researchRestrictionEvents.map(x => {
              return {
                eventId: x.eventId,
                eventPropertyName: x.eventPropertyName,
                value: x.value
              };
            }) : [];
        }, error => {
          this.isSetLoading = false;
        })
      }
      this.isCreateNewSet = true;
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
    this.permissionWizard.clear();
    this.isCreateNewSet = false;
    this.currentSet = undefined;
  }

  addPermissinSet(ps: any): void {
    if (!ps) { return; }
    if (this.currentSet) {
      this.userEditService.replaceResearcher(this.currentSet, ps);
    } else {
      this.userEditService.addSet(ps);
    }
    this.isCreateNewSet = false;
    this.initData();
    this.currentSet = undefined;
  }
}
