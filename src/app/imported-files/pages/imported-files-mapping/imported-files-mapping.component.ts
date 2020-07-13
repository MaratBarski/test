import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ComponentService, DateService, PopupComponent, SelectOption, TableComponent, TranslateService} from '@appcore';
import {FileClm, FileSource} from '../../models/file-source';
import {ActivatedRoute, Router} from '@angular/router';
import {Template} from '@app/models/template';
import {Hierarchy} from '@app/models/hierarchy';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ImportedFilesMappingService} from '@app/imported-files/services/imported-files-mapping.service';
import {map} from 'rxjs/operators';
import {PropertyType} from '@app/imported-files/models/enum/PropertyType';
import {NotificationsService, ToasterType} from '@appcore';

@Component({
  selector: 'md-imported-files-mapping',
  templateUrl: './imported-files-mapping.component.html',
  styleUrls: ['./imported-files-mapping.component.scss']
})
export class ImportedFileMappingComponent implements OnInit, OnDestroy {
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
  @ViewChild('popupMenu', {static: true}) popupMenu: PopupComponent;
  @ViewChild('table', {static: true}) table: TableComponent;

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    public componentService: ComponentService,
    private importedFilesMappingService: ImportedFilesMappingService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService
  ) {
    this.fileSource = this.route.snapshot.data.data[0];
    this.templates = this.route.snapshot.data.data[1];
    this.hierarchies = this.route.snapshot.data.data[2];
    this.selectAll = new FormControl(true);

    this.selectAll.valueChanges
      .subscribe(select => {
        const pointer: FormArray = this.fileSourceForm.get('fileClms') as FormArray;
        if (select) {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < pointer.controls.length; i++) {
            pointer.controls[i].get('isIncluded').setValue(true);
          }
        } else {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < pointer.controls.length; i++) {
            pointer.controls[i].get('isIncluded').setValue(false);
          }
        }
      });
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
  }

  private createFileSourceForm(): FormGroup {
    console.log(this.fileSource.fileType);
    return this.formBuilder.group({
      fileId: [this.fileSource.fileId],
      fileName: [this.fileSource.fileName],
      filePath: [this.fileSource.filePath],
      fileNameAlias: [this.fileSource.fileNameAlias],
      tag: [this.fileSource.tag],
      insertDate: [this.fileSource.insertDate],
      templateId: [this.fileSource.templateId, Validators.required],
      tableName: [this.fileSource.tableName],
      project: [this.fileSource.tableName],
      uploadedBy: [this.fileSource.uploadedBy],
      fileType: [this.fileSource.fileType],
      fileClms: this.buildClmFormArray(),
      rowsNum: [this.fileSource.rowsNum],
      columnsNum: [this.fileSource.columnsNum],
    });
  }

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

  ngOnDestroy(): void {

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
      this.importedFilesMappingService.saveMappedData(this.fileSourceForm.getRawValue()).subscribe(responce => {
        this.isSaving = false;
        this.router.navigateByUrl('/imported-files');
      }, error => {
      });
    }
  }

  cancel() {
    this.router.navigateByUrl('/imported-files');
  }
}
