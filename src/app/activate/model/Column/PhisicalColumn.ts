import {IColumn} from '../interfaces/IColumn';
import {AbstractColumn} from './AbstractColumn';
import {FileClm} from '@app/imported-files/models/file-source';

export class PhysicalColumn extends AbstractColumn {

  public constructor(item: FileClm) {
    super(item);
  }

  public isCalculatedField() {
    return false;
  }

  public getColumn() {
    return ` ${this.physicalName} `;
  }
}
