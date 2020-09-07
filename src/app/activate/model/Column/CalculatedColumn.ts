// import {ExpressionBuilder} from '../CalculatedFields/ExpressionBuilder';
// import {IColumn} from '../interfaces/IColumn';
import {AbstractColumn} from './AbstractColumn';
import {ExpressionToken} from './ExpressionToken';
import {FileClm} from '@app/imported-files/models/file-source';

export class CalculatedColumn extends AbstractColumn {
  public tokens: ExpressionToken[];
  private expression: string = '';

  public constructor(item: FileClm) {
    super(item);
    // this.tokens = item.tokens;
  }

  public isCalculatedField() {
    return true;
  }

  // public getColumn(calculatedObject: CalculateObject): string {
  //   // return this.buildFromToken(calculatedObject);
  //   return '';
  // }

  // private buildFromToken(calculatedObject: CalculateObject): string {
  //   if (this.expression === "") {
  //     this.expression = new ExpressionBuilder(this, calculatedObject).buildExpresstion();
  //   }
  //   return this.expression;
  // }
}
