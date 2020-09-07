import {FieldType} from '../enum/FieldType';
import {IColumn} from '../interfaces/IColumn';
import {CalculatedColumn} from './CalculatedColumn';
import {PhysicalColumn} from './PhisicalColumn';
import {FileClm} from '@app/imported-files/models/file-source';

export class ColumnFactory {
  public static buildColumnFromFileClm(item: FileClm): IColumn {
    // if (item.fieldType === FieldType.REGULAR) {
      return new PhysicalColumn(item);
    // } else {
    //   return new CalculatedColumn(item);
    // }
  }
}
