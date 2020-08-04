import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import {
  ComponentService,
  PopupComponent,
  SelectOption,
  TableComponent,
  NavigationService,
  BaseNavigation,
  NotificationsService,
  ToasterType
} from '@appcore';
import { FileClm, FileSource } from '../../models/file-source';
import { ActivatedRoute, Router } from '@angular/router';
import { Template } from '@app/models/template';
import { Hierarchy } from '@app/models/hierarchy';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImportedFilesMappingService } from '@app/imported-files/services/imported-files-mapping.service';
import { map } from 'rxjs/operators';
import { PropertyType } from '@app/imported-files/models/enum/PropertyType';
import { ConfigService } from '@app/shared/services/config.service';

@Component({
  selector: 'md-imported-files-mapping',
  templateUrl: './imported-files-mapping.component.html',
  styleUrls: ['./imported-files-mapping.component.scss']
})
export class ImportedFileMappingComponent extends BaseNavigation implements OnInit, AfterViewChecked {
  legendActive = false;
  fileSource: FileSource;
  fileSourceForm: FormGroup;
  templates: Template[] = [];
  hierarchies: Hierarchy[] = [];
  templateSelectOptions: SelectOption[] = [];
  hierarchySelectOptions: SelectOption[] = [];
  propertyType = PropertyType;
  selectAll: FormControl;
  showErrors: boolean = false;
  isSaving = false;
  showCancelConfirm = false;
  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;
  @ViewChild('table', { static: true }) table: TableComponent;
  private redirectUrl = '';

  constructor(
    public componentService: ComponentService,
    private importedFilesMappingService: ImportedFilesMappingService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    protected navigationService: NavigationService,
    private cdRef: ChangeDetectorRef,
    private notificationService: NotificationsService,
    private configService: ConfigService
  ) {
    super(navigationService);
    super.add(
      this.route.params.subscribe(p => {
        this.fileSource = this.route.snapshot.data.data[0];
        this.fileSource.fileClms.sort((fileClm1, fileClm2) => {
          const [val1, val2] = [Number(fileClm1.physicalColName.split('_')[1]), Number(fileClm2.physicalColName.split('_')[1])];
          return val1 > val2 ? 1 : -1;
        });
        this.templates = this.route.snapshot.data.data[1].sort((item1, item2) => {
          return item1.templateName.toLowerCase() > item2.templateName.toLowerCase() ? 1 : -1;
        });
        this.hierarchies = this.route.snapshot.data.data[2].sort((item1, item2) => {
          return item1.hierarchyName > item2.hierarchyName ? 1 : -1;
        });
        this.selectAll = new FormControl(true);
        super.add(
          this.selectAll.valueChanges
            .subscribe(select => {
              const pointer: FormArray = this.fileSourceForm.get('fileClms') as FormArray;
              if (select) {
                for (let i = 0; i < pointer.controls.length; i++) {
                  pointer.controls[i].get('isIncluded').setValue(true);
                }
              } else {
                for (let i = 0; i < pointer.controls.length; i++) {
                  pointer.controls[i].get('isIncluded').setValue(false);
                }
              }
            }));

        this.templateSelectOptions.push({
          id: 0,
          text: 'no template defined'
        });
        this.templates.forEach(item => {
          const tmp: SelectOption = new SelectOption();
          tmp.id = item.templateId;
          tmp.text = item.templateName;
          this.templateSelectOptions.push(tmp);
        });

        this.hierarchySelectOptions.push({
          id: 0,
          text: 'Select categorization...'
        });
        this.hierarchies.forEach(item => {
          const tmp: SelectOption = new SelectOption();
          tmp.id = item.hierarchyRootId;
          tmp.text = item.hierarchyName;
          this.hierarchySelectOptions.push(tmp);
        });

        this.fileSourceForm = this.createFileSourceForm();

        this.navigationService.beforeNavigate = ((url: string) => {
          if (url) {
            this.redirectUrl = url;
          }
          const data = JSON.stringify(this.fileSourceForm.getRawValue());
          if (this.originSource !== data) {
            this.showCancelConfirm = !!url;
            return true;
          }
          if (url) {
            this.router.navigateByUrl(url);
          }
        });
      }));
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  private createFileSourceForm(): FormGroup {
    console.log(this.fileSource.fileType);
    const res = this.formBuilder.group({
      fileId: [this.fileSource.fileId],
      fileName: [this.fileSource.fileName],
      filePath: [this.fileSource.filePath],
      fileNameAlias: [this.fileSource.fileNameAlias],
      tag: [this.fileSource.tag],
      insertDate: [this.fileSource.insertDate],
      templateId: [this.fileSource.templateId],
      tableName: [this.fileSource.tableName],
      project: [this.fileSource.tableName],
      uploadedBy: [this.fileSource.uploadedBy],
      fileType: [this.fileSource.fileType],
      fileClms: this.buildClmFormArray(),
      rowsNum: [this.fileSource.rowsNum],
      columnsNum: [this.fileSource.columnsNum],
    });
    this.originSource = JSON.stringify(res.getRawValue());
    return res;
  }

  private originSource = '';

  private buildClmFormArray(): FormArray {
    const formArray: FormArray = this.formBuilder.array([]);
    this.fileSource.fileClms.forEach(clm => {
      formArray.push(this.buildFileClmGroup(clm));
    });
    return formArray;
  }

  private buildFileClmGroup(item: FileClm): FormGroup {
    return this.formBuilder.group({
      fileId: [item.fileId],
      fieldName: [item.fieldName],
      propertyType: [item.propertyType],
      description: [item.description],
      dataSample: [item.dataSample],
      hierarchyRootId: item.hierarchyRootId ? [item.hierarchyRootId] : [0],
      isIncluded: [item.isIncluded],
      physicalColName: [item.physicalColName],
      defaultLevelId: [item.defaultLevelId],
      defaultValue: [item.defaultValue],
      percent: [-1],
    });
  }

  ngOnInit() {
    // emit 0 after 1 second then complete, since no second argument is supplied
    /*const source = timer(1000, 2000);
    // output: 0
    const subscribe = source.subscribe(val => {
      console.log(val);
      this.percent = Math.floor(Math.random() * 100);
    });*/
  }

  needTooltip(div): boolean {
    if (div.children.length > 0) {
      return div.children[0].offsetWidth < div.children[0].scrollWidth;
    } else {
      return false;
    }
  }

  getRelationalIntegrity(hieId, columnIndex) {
    this.fileSourceForm.get('fileClms')['controls'][columnIndex].get('percent').setValue(-1);
    const hierarchyId = hieId.id;
    const colIndex = columnIndex + 1;
    const fileName = this.fileSource.fileNameAlias;
    const filePath = this.fileSource.filePath;
    const numOfCols = this.fileSource.fileClms.length;
    return this.importedFilesMappingService.checkRelationalIntegrity({
      hierarchyId,
      colIndex,
      fileName,
      filePath,
      numOfCols,
      fileId: this.fileSource.fileId
    }).pipe(map(data => {
      if (data.success === 'success') {
        return data.percent;
      } else {
        return 0;
      }
    })).subscribe(data => {
      (this.fileSourceForm.get('fileClms') as FormArray).controls[columnIndex].get('percent').setValue(data);
    });
  }

  saveFileSource() {
    if (!this.fileSourceForm.valid) {
      this.showErrors = true;
    } else {
      this.isSaving = true;
      const tmp = this.fileSourceForm.getRawValue();
      tmp.templateId = tmp.templateId === 0 ? '' : tmp.templateId;

      for (let i = 0; i < tmp.fileClms.length; i++) {
        if (tmp.fileClms[i].hierarchyRootId === 0) {
          tmp.fileClms[i].hierarchyRootId = '';
        }
      }
      this.configService.getFormKey().then(key => {
        this.importedFilesMappingService.saveMappedData(this.fileSourceForm.getRawValue())
          .subscribe(responce => {
            this.isSaving = false;
            this.router.navigateByUrl('/imported-files');
          }, error => {
            this.saveError();
          });
      }).catch(er => {
        this.saveError();
      })
    }
  }

  private saveError(): void {
    this.isSaving = false;
    this.notificationService.addNotification({
      type: ToasterType.error,
      name: 'Failed to save file mapping',
      comment: 'Try again or contact MDClone support.',
      showInToaster: true
    });
  }

  cancel(event: any) {
    if (event) {
      event.preventDefault();
    }
    this.navigationService.navigate('/imported-files');
  }

  confirmSave(): void {
    this.showCancelConfirm = false;
    this.router.navigateByUrl(this.redirectUrl || '/imported-files');
    //this.saveFileSource();
  }

  cancelSave(): void {
    this.showCancelConfirm = false;
  }
}
