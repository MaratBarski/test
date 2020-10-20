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
import {ActivateService, Research} from '@app/activate/services/activate.service';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {FieldDataType} from '@app/activate/model/enum/FieldDataType';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {LoginService} from '@appcore';
import {ConfigService} from '@app/shared/services/config.service';

export class UserIRB {
  irb: Research[];

  constructor(irb: Research[]) {
    this.irb = irb;
  }

  getIrbByProject(projectId: number): Research[] {
    return this.irb.filter(item => +item.project.projectId === +projectId);
  }
}

@Component({
  selector: 'md-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent extends BaseNavigation implements OnInit {
  showSwitch = false;
  switchState = false;
  censoredRate: any = null;
  censoredPercent = 0;
  calculation = false;
  showIRBPopup = true;

  anonymityRequest: number = null;
  userAnonymity: number = null;
  defaultAnonymity = 4;
  systemAnonymity: number = null;
  userIRB: UserIRB;
  projectIRB: Research[] = [];

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
    private config: ConfigService,
    private loginService: LoginService,
    private router: Router,
  ) {
    super(navigationService);
    this.fileSource = this.route.snapshot.data.data[0];
    this.userIRB = new UserIRB(this.route.snapshot.data.data[1]);
    this.projectIRB = this.userIRB.getIrbByProject(this.fileSource.project);

    this.userAnonymity = this.getUserAnonymity(this.fileSource.project);
    if (this.userAnonymity === 1 || this.userIRB.getIrbByProject(this.fileSource.project).length > 0) {
      this.showSwitch = true;
    } else {
      this.showSwitch = false;
    }

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
      this.route.queryParams.subscribe(params => {
        if (params.anonymity) {
          this.anonymityRequest = +params.anonymity;
          this.switchState = true;
        } else {
          this.anonymityRequest = null;
          this.switchState = false;
        }
        this.getCensoredRate();
      })
    );

    super.add(
      this.route.params.subscribe(p => {
        console.log(this.config.config);
        // this.defaultAnonymity = this.config.config
        if (this.fileSource.fileState) {
          this.columnCollection = this.fileSource.fileState;
          this.columnCollection.forEach(clm => {
            const column: IColumn = clm;
            if (column.hierarchyRootId && column.hierarchyRootId > -1) {
              column.hierarchy = this.activateService.getHierarchy(column.hierarchyRootId).pipe(map((data: Hierarchy) => {
                this.columnCollection.forEach((col, index) => {
                  if (data.hierarchyRootId == col.hierarchyRootId) {
                    this.columnCollection[index].defaultLevelId = data.defaultLevelId ? data.defaultLevelId : data.hierarchyLevels[0].hierarchyLevelId;
                  }
                });
                return data.hierarchyLevels.map(item => {
                  return {
                    isChecked: data.defaultLevelId === item.hierarchyLevelId,
                    text: item.hierarchyLevelName,
                    id: item.hierarchyLevelId,
                  };
                });
              }));

            }
          });
        } else {
          this.fileSource.fileClms.forEach(clm => {
            const column: IColumn = new PhysicalColumn(clm);
            if (column.hierarchyRootId && column.hierarchyRootId > -1) {
              column.hierarchy = this.activateService.getHierarchy(column.hierarchyRootId).pipe(map((data: Hierarchy) => {
                this.columnCollection.forEach((col, index) => {
                  if (data.hierarchyRootId == col.hierarchyRootId) {
                    this.columnCollection[index].defaultLevelId = data.defaultLevelId ? data.defaultLevelId : data.hierarchyLevels[0].hierarchyLevelId;
                  }
                });
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
        }
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

  calculate() {
    this.saveState().subscribe(data => {
      this.getCensoredRate();
    });
  }

  public getUserAnonymity(project): number {
    if (false) {
      return 1;
    } else {
      return this.loginService.getAnonymityKeyByProject(project);
    }
  }

  public switchSyntheticMode($event) {
    if ($event) {
      // ${this.defaultAnonymity}
      this.router.navigateByUrl(`activate/${this.fileSource.fileId}?anonymity=${this.defaultAnonymity}`);
    } else {
      this.router.navigateByUrl(`activate/${this.fileSource.fileId}`);
    }
    console.log($event);
    console.log(this.showSwitch);
  }

  public drop($event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnCollection, $event.previousIndex, $event.currentIndex);
    this.columnCollection = [...this.columnCollection];
  }

  public changeCollectionObject() {
    this.selectAll = this.columnCollection.filter(item => item.include).length === this.columnCollection.length ? true : false;
    this.columnCollection = [...this.columnCollection];
    this.calculate();
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
    } else if (column.rootType === FieldDataType.DATE && column.outputType !== FieldDataType.DATE) {
      this.columnCollection[index].outputType = FieldDataType.DATE;
    }
    if (column.rootType === FieldDataType.NUMERIC && column.outputType === FieldDataType.NUMERIC) {
      this.columnCollection[index].outputType = FieldDataType.STRING;
    } else if (column.rootType === FieldDataType.NUMERIC && column.outputType === FieldDataType.STRING) {
      this.columnCollection[index].outputType = FieldDataType.NUMERIC;
    }
    this.calculate();
  }

  nullsRate(anonymity) {
    this.activateService.nullsRate(this.fileSource.fileId, anonymity).subscribe((data: any) => {
      const nulls = data.data.data.nullsRate;
      this.columnCollection.forEach((col, index) => {
        this.columnCollection[index].nullRate = nulls[col.physicalName] * 100;
      });
    });
  }

  getSampleData(column: IColumn) {
    if (!column.sample) {
      this.activateService.getSampleData(this.fileSource.fileId, column.physicalName, column.rootType, 4).subscribe((data: any) => {
        const index = this.columnCollection.findIndex(col => col.physicalName === column.physicalName);
        this.columnCollection[index].sample = data.data;
        console.log(data);
      });
    }
  }

  createState() {
    this.saveState().subscribe(data => {

    });
  }

  saveState() {
    return this.activateService.updateFileSourceState(this.fileSource.fileId, this.columnCollection);
  }

  getCensoredRate() {
    this.calculation = true;
    if (this.anonymityRequest !== null && this.userAnonymity < this.anonymityRequest) {
      this.nullsRate(this.anonymityRequest);
      return this.activateService.getCensoredRate(this.fileSource.fileId, this.anonymityRequest).subscribe((data: any) => {
        this.censoredRate = data.data;
        this.censoredPercent = (1 - data.data.rows_no_censored) * 100;
        this.calculation = false;
        // debugger;
        console.log('censoredRate = ', this.censoredRate);
      });
    } else if (this.userAnonymity > 1 && this.userIRB.getIrbByProject(this.fileSource.project).length === 0) {
      this.nullsRate(this.userAnonymity);
      return this.activateService.getCensoredRate(this.fileSource.fileId, this.userAnonymity).subscribe((data: any) => {
        this.censoredRate = data.data;
        this.censoredPercent = (1 - data.data.rows_no_censored) * 100;
        this.calculation = false;
        // debugger;
        console.log('censoredRate = ', this.censoredRate);
      });
    } else if ((this.anonymityRequest === null && this.userAnonymity === 1) ||
      (this.anonymityRequest === null && this.userIRB.getIrbByProject(this.fileSource.project).length > 0)) {
      this.nullsRate(1);
      this.censoredRate = null;
      this.calculation = false;
      // debugger;
      console.log('censoredRate = ', this.censoredRate);
    } else if (this.anonymityRequest === null && this.userAnonymity > 1 && this.userIRB.getIrbByProject(this.fileSource.project).length > 0) {
      this.nullsRate(this.defaultAnonymity);
      return this.activateService.getCensoredRate(this.fileSource.fileId, this.defaultAnonymity).subscribe((data: any) => {
        this.censoredRate = data.data;
        this.censoredPercent = (1 - data.data.rows_no_censored) * 100;
        this.calculation = false;
        // debugger;
        console.log('censoredRate = ', this.censoredRate);
      });
    }

  }

  getCensoredFile() {
    this.activateService.updateFileSourceState(this.fileSource.fileId, this.columnCollection).pipe(switchMap(result => {
      return this.activateService.getCensoredFile(this.fileSource.fileId, 4);
    })).subscribe(data => {
      let fileName = data.headers.get('Content-Disposition');
      fileName = fileName.split(';')[1].trim().split('=')[1].replace(/\"/g, '');
      const element = document.createElement('a');
      element.href = URL.createObjectURL(data.body);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      element.remove();
    });
  }

  downloadOriginal() {
    this.activateService.updateFileSourceState(this.fileSource.fileId, this.columnCollection).pipe(switchMap(result => {
      return this.activateService.downloadOriginalFile(this.fileSource.fileId);
    })).subscribe(data => {
      let fileName = data.headers.get('Content-Disposition');
      fileName = fileName.split(';')[1].trim().split('=')[1].replace(/\"/g, '');
      const element = document.createElement('a');
      element.href = URL.createObjectURL(data.body);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      element.remove();
    });
  }

  closePopup(bool) {
    this.showIRBPopup = false;
  }
}

