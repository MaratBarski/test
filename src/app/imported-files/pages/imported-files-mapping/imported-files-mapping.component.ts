import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DateService, PopupComponent, SelectOption, SwitchButtonModel, TableComponent, TranslateService} from '@appcore';
import {ImportedFilesService} from '../../services/imported-files.service';
import {Store} from '@ngrx/store';
import {FileClm, FileSource} from '../../models/file-source';
import {ActivatedRoute} from '@angular/router';
import {Template} from '@app/models/template';
import {Hierarchy} from '@app/models/hierarchy';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {timer} from 'rxjs';

@Component({
  selector: 'md-imported-files-mapping',
  templateUrl: './imported-files-mapping.component.html',
  styleUrls: ['./imported-files-mapping.component.scss']
})
export class ImportedFileMappingComponent implements OnInit, OnDestroy {
  fileSource: FileSource;
  fileSourceForm: FormGroup;
  templates: Template[] = [];
  hierarchies: Hierarchy[] = [];
  templateSelectOptions: SelectOption[] = [];
  hierarchySelectOptions: SelectOption[] = [];
  opened = false;

  @ViewChild('popupMenu', {static: true}) popupMenu: PopupComponent;
  @ViewChild('table', {static: true}) table: TableComponent;

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    private importedFilesService: ImportedFilesService,
    private store: Store<any>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.fileSource = this.route.snapshot.data.data[0];
    this.templates = this.route.snapshot.data.data[1];
    this.hierarchies = this.route.snapshot.data.data[2];

    this.templates.forEach(item => {
      const tmp: SelectOption = new SelectOption();
      tmp.id = item.templateId;
      tmp.text = item.templateName;
      this.templateSelectOptions.push(tmp);
    });

    this.hierarchies.forEach(item => {
      const tmp: SelectOption = new SelectOption();
      tmp.id = item.hierarchyRootId;
      tmp.text = item.hierarchyName;
      this.hierarchySelectOptions.push(tmp);
    });

    this.fileSourceForm = this.createFileSourceForm();
  }

  private toggleShare() {
    this.opened = !this.opened;
  }

  private createFileSourceForm(): FormGroup {
    return this.formBuilder.group({
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
      hierarchyRootId: [item.hierarchyRootId],
      isIncluded: [item.isIncluded],
      physicalColName: [item.physicalColName],
      defaultLevelId: [item.defaultLevelId],
      defaultValue: [item.defaultValue],
    });
  }

  ngOnDestroy(): void {

  }

  public percent = 0;

  ngOnInit() {
    // emit 0 after 1 second then complete, since no second argument is supplied
    const source = timer(1000, 2000);
    // output: 0
    const subscribe = source.subscribe(val => {
      console.log(val);
      this.percent = Math.floor(Math.random() * 100);
    });
  }

  saveFileSource() {
    console.log(this.fileSourceForm.getRawValue());
    console.log(this.fileSourceForm);
  }
}
