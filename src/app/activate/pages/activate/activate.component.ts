import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {BaseNavigation, NavigationService, SelectOption} from '@appcore';
import {ActivatedRoute, Router} from '@angular/router';
import {FileSource} from '@app/imported-files/models/file-source';
import {Template} from '@app/models/template';
import {Hierarchy} from '@app/models/hierarchy';
import {PropertyType} from '@app/imported-files/models/enum/PropertyType';
// import {CalculateObject} from '@app/activate/model/CalculateObject';
import {IColumn} from '@app/activate/model/interfaces/IColumn';
import {PhysicalColumn} from '@app/activate/model/Column/PhisicalColumn';
import {ActivateService} from '@app/activate/services/activate.service';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
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
  showFilterModal = false;
  // searchControl: FormControl;


  fileSourceForm: FormGroup;
  templates: Template[] = [];
  hierarchies: Hierarchy[] = [];
  templateSelectOptions: SelectOption[] = [];
  hierarchySelectOptions: SelectOption[] = [];
  showCancelConfirm = false;
  selectAll: boolean;

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
        this.selectAll = this.columnCollection.filter(item => item.include).length === this.columnCollection.length ? true : false;
        this.columnCollection.sort((c1, c2) => {
          const [val1, val2] = [Number(c1.order), Number(c2.order)];
          return val1 > val2 ? 1 : -1;
        });
      }));

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
  }

  ngOnInit() {
  }

  public drop($event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnCollection, $event.previousIndex, $event.currentIndex);
    this.columnCollection = [...this.columnCollection];
  }

  public changeCollectionObject() {
    this.selectAll = this.columnCollection.filter(item => item.include).length === this.columnCollection.length ? true : false;
    this.columnCollection = [...this.columnCollection];
  }

  public selectAllChanged($event) {
    if ($event === true) {
      this.columnCollection.map(item => item.include = true);
    } else {
      this.columnCollection.map(item => item.include = false);
    }
    this.changeCollectionObject();
  }

  closeFilterModal() {
    this.showFilterModal = false;
  }

  openFilterModal() {
    this.showFilterModal = true;
  }

  public changeType(column: IColumn) {
    if (column.rootType === FieldDataType.STRING) {
      return;
    }
    const index = this.columnCollection.findIndex(col => col.physicalName === column.physicalName);
    if (column.rootType === FieldDataType.DATE && column.outputType === FieldDataType.DATE) {
      this.columnCollection[index].outputType = FieldDataType.STRING;
    } else if (column.rootType === FieldDataType.DATE && column.outputType === FieldDataType.DATE) {
      this.columnCollection[index].outputType = FieldDataType.DATE;
    }
    if (column.rootType === FieldDataType.NUMERIC && column.outputType === FieldDataType.NUMERIC) {
      this.columnCollection[index].outputType = FieldDataType.STRING;
    } else if (column.rootType === FieldDataType.NUMERIC && column.outputType === FieldDataType.STRING) {
      this.columnCollection[index].outputType = FieldDataType.NUMERIC;
    }
  }

  downloadOriginal() {
    console.log(this.columnCollection);
  }

}
