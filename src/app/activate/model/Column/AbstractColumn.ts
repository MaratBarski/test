import {FieldDataType} from '../enum/FieldDataType';
import {FieldType} from '../enum/FieldType';
// import {CalculateObject} from '../CalculateObject';
// import {FieldFilterAbstract} from '../ColumnFilter/FieldFilterAbstract';
// import {FilterFactory} from '../ColumnFilter/FilterFactory';
import {FileClm} from '@app/imported-files/models/file-source';
import {Observable} from 'rxjs';
import {Hierarchy} from '@app/models/hierarchy';
import {CheckBoxListOption} from '@appcore';

export abstract class AbstractColumn {
  public physicalName: string;
  public aliasName: string;
  public include: boolean;
  public order: number;
  public sample: string;
  public rootType: FieldDataType;
  public outputType: FieldDataType;
  // public filter: FieldFilterAbstract;
  public hierarchy: Observable<Array<CheckBoxListOption>>;
  public fieldType: FieldType;
  public hierarchyRootId: number;
  public defaultLevelId: number;
  public isShown: boolean;
  public nullRate: number;

  constructor(item: FileClm) {
    this.physicalName = item.physicalColName;
    this.aliasName = item.fieldName;
    this.include = item.isIncluded;
    this.order = Number(item.physicalColName.split('_')[1]);
    this.sample = item.dataSample;
    this.rootType = item.propertyType;
    this.outputType = item.propertyType;
    // this.filter = FilterFactory.buildFilter(item.filter, this.phisicalName);
    this.fieldType = FieldType.REGULAR;
    this.isShown = true;
    this.hierarchyRootId = item.hierarchyRootId;
    this.defaultLevelId = item.defaultLevelId;
  }

  public getSampleData() {
    // return this.sample ? this.sample.split(constants.STRING_SEPARATOR) : [];
  }

  public abstract isCalculatedField(): boolean;
  // public abstract getColumn(calculatedObject: CalculateObject): string;
}
