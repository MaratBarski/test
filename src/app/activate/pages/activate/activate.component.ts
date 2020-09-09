import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {BaseNavigation, NavigationService, SelectOption} from '@appcore';
import {ActivatedRoute, Router} from '@angular/router';
import {FileClm, FileSource} from '@app/imported-files/models/file-source';
import {Template} from '@app/models/template';
import {Hierarchy} from '@app/models/hierarchy';
import {PropertyType} from '@app/imported-files/models/enum/PropertyType';
// import {CalculateObject} from '@app/activate/model/CalculateObject';
import {IColumn} from '@app/activate/model/interfaces/IColumn';
import {PhysicalColumn} from '@app/activate/model/Column/PhisicalColumn';
import {ActivateService} from '@app/activate/services/activate.service';
import {debounceTime, distinctUntilChanged, map, takeUntil} from 'rxjs/operators';
import {FieldDataType} from '@app/activate/model/enum/FieldDataType';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'md-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent extends BaseNavigation implements OnInit {
  // calculateObj: CalculateObject;
  columnCollection: Array<IColumn> = [];
  fieldDataType = FieldDataType;
  fileSource: FileSource;
  fg: FormGroup;
  // searchControl: FormControl;


  fileSourceForm: FormGroup;
  templates: Template[] = [];
  hierarchies: Hierarchy[] = [];
  templateSelectOptions: SelectOption[] = [];
  hierarchySelectOptions: SelectOption[] = [];
  showCancelConfirm = false;
  selectAll: FormControl;
  propertyType = PropertyType;
  showErrors: boolean = false;
  isSaving = false;
  legendActive = false;
  private originSource = '';
  private redirectUrl = '';

  constructor(
    protected navigationService: NavigationService,
    protected activateService: ActivateService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(navigationService);
    this.fg = new FormGroup({
      searchInput: new FormControl('')
    });
    super.add(
      this.fg.get('searchInput').valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((searchText: string) => {
        this.columnCollection = [...this.columnCollection.map(item => {
          if (item.aliasName.includes(searchText)) {
            item.isShown = true;
          } else {
            item.isShown = false;
          }
          return item;
        })];
      })
    );
    super.add(
      this.route.params.subscribe(p => {
        this.fileSource = this.route.snapshot.data.data[0];
        this.fileSource.fileClms.forEach(clm => {
          const column: IColumn = new PhysicalColumn(clm);
          if (column.hierarchyRootId && column.hierarchyRootId > -1) {
            column.hierarchy = this.activateService.getHierarchy(column.hierarchyRootId).pipe(map((data: Hierarchy) => {
              return data.hierarchyLevels.map(item => {
                return {
                  isChecked: data.defaultLevelId === item.hierarchyLevelId,
                  text: item.hierarchyLevelName,
                  id: item.hierarchyLevelId,
                };
              });
            }));
          }
          this.columnCollection.push(column);
        });
        this.columnCollection.sort((c1, c2) => {
          const [val1, val2] = [Number(c1.order), Number(c2.order)];
          return val1 > val2 ? 1 : -1;
        });
        // this.fileSource.fileClms.sort((fileClm1, fileClm2) => {
        //   const [val1, val2] = [Number(fileClm1.physicalColName.split('_')[1]), Number(fileClm2.physicalColName.split('_')[1])];
        //   return val1 > val2 ? 1 : -1;
        // });

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

        this.hierarchySelectOptions.push({
          id: 0,
          text: 'Select categorization...'
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

  ngOnInit() {
  }

  public drop($event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnCollection, $event.previousIndex, $event.currentIndex);
    this.columnCollection = [...this.columnCollection];
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

}
