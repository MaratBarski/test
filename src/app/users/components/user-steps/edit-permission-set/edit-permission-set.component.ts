import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent, CheckBoxListComponent, DownloadComponent, CheckBoxListOption, EmptyState, TableModel, BaseSibscriber, TableActionCommand } from '@appcore';
import { ResearchService } from '@app/users/services/research.service';
import { ConfigService } from '@app/shared/services/config.service';

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
  researchSource: Array<any>;
  onComplete: any;
  downloadFileName = 'research.csv';

  constructor(
    private researchService: ResearchService,
    public configService: ConfigService
  ) {
    super();
  }

  private initData(): void {
    this.isDataExists = !!(this.researchSource && this.researchSource.length);
    this.dataOrigin = this.dataSource = this.researchService.createView(this.researchSource);
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
      // this.researchSource = this.researchSource.filter(x => x != action.item.source);
      // this.initData();
      // this.table.stayOnCurrentPage = true;
      // this.researchService.deleteFile(action.item.source)
      //   .toPromise()
      //   .then(res => {
      //     console.log('File deleted');
      //   }).catch(e => {
      //     console.error('Error delete file');
      //   })
    }
  };
  
  ngOnInit() {
    this.isLoaded = false;
    super.add(
      this.researchService.load().subscribe((res: any) => {
        this.researchSource = res.data || [];
        this.initData();
      }));
    this.onComplete = (): void => {
      super.add(
        this.researchService.load().subscribe((res: any) => {
          this.researchSource = res.data || [];
          this.initData();
          this.table.stayOnCurrentPage = true;
        }));
    }
  }

  isActive(src: any): boolean {
    return this.researchService.isActive(src, true, false);
  }

}
