import {FieldType} from '../enum/FieldType';
import {IColumn} from '../interfaces/IColumn';
import {CalculatedColumn} from './CalculatedColumn';
import {PhysicalColumn} from './PhisicalColumn';
import {FileClm} from '@app/imported-files/models/file-source';

export class ColumnFileClmFactory {
  public static buildColumnFromFileClm(item: FileClm): IColumn {
    return new PhysicalColumn(item);
  }
}
