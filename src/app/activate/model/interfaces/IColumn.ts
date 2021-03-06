import {FieldDataType} from '../enum/FieldDataType';
import {FieldType} from '../enum/FieldType';
// import {CalculateObject} from '../CalculateObject';
import {ExpressionToken} from '../Column/ExpressionToken';
import {Observable} from 'rxjs';
import {Hierarchy} from '@app/models/hierarchy';
import {CheckBoxListOption} from '@appcore';
// import {FieldFilterAbstract} from '../ColumnFilter/FieldFilterAbstract';

export interface IColumn {
  physicalName: string;
  aliasName: string;
  include: boolean;
  order: number;
  sample: string;
  rootType: FieldDataType;
  outputType: FieldDataType;
  hierarchy: Observable<Array<CheckBoxListOption>>;
  fieldType: FieldType;
  hierarchyRootId: number;
  defaultLevelId: number;
  isShown: boolean;
  tokens?: ExpressionToken[];
  nullRate: number;
//  filter?: FieldFilterAbstract;

  getSampleData();

  isCalculatedField();

  // getColumn(calculatedObject: CalculateObject);
}
