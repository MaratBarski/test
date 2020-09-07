// import {ColumnCollection} from './ColumnCollection';
// import {IColumn} from './interfaces/IColumn';
// import {FieldDataType} from './enum/FieldDataType';
// import {FileSource} from '@app/models/file-source';
//
// export class CalculateObject {
//   public fileName: string;
//   public columns: ColumnCollection<any>;
//   // public reference_date_internal?: string;
//   // public reference_date_internal_PN?: string;
//   public fileCreate?: boolean;
//
//   constructor(calculateTDO: FileSource) {
//     this.fileName = calculateTDO.fileName;
//
//     // this.reference_date_internal = calculateTDO.reference_date_internal;
//     // this.reference_date_internal_PN = calculateTDO.reference_date_internal_PN;
//     // this.columns = new ColumnCollection<IColumn>(calculateTDO.);
//   }
//
//   public getDiscretColumns(): string[] {
//     const cols: string[] = [];
//     for (let i = 0; i < this.columns.length; i++) {
//       if (this.columns[i].outputType === FieldDataType.STRING) {
//         cols.push(this.columns[i].phisicalName);
//       }
//     }
//     return cols;
//   }
//
//   public getNotDiscretColumns(): string[] {
//     const cols: string[] = [];
//     for (let i = 0; i < this.columns.length; i++) {
//       if (this.columns[i].outputType !== FieldDataType.STRING) {
//         cols.push(this.columns[i].phisicalName);
//       }
//     }
//     return cols;
//   }
// }
