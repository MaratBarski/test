import { Injectable } from '@angular/core';
import { TableModel } from '../components/table/table.component';

declare const require: any;
export const Encoding = require('encoding-japanese');

export const ExcelExtentions = ['csv', 'xls', 'xlsx', 'xlsm', 'xlsb'];

export interface CsvData {
  headers: Array<string>;
  data?: Array<Array<any>>;
}

export enum ValidationFileMessage {
  Success = 'success',
  UniquenessOfHeadersError = 'uniquenessOfHeadersError',
  HeaderEmptyError = 'headerEmptyError',
  NullOnHeadersError = 'nullOnHeadersError',
  CsvExtensionError = 'csvExtensionError',
  FileSizeError = 'fileSizeError',
  NoHebrewHeaders = "noHebrewHeaders",
  NoName = 'noName',
  FileEmpty = 'fileEmpty',
  NoUtf8 = 'noUtf8',
  NoRows = 'noRows',
  FileExists = 'fileExists',
  OtherError = 'otherError',
  FileSizeLimitError = 'fileSizeLimitError',
  NoEnglish = 'noEnglish'
}
@Injectable({
  providedIn: 'root'
})
export class CsvManagerService {


  createLinkFromTable(table: TableModel): string {
    const csvData: CsvData = { headers: [], data: [] };
    const columns = [];
    table.headers.filter(x => x.csvTitle).forEach(h => {
      columns.push(h.columnId);
      csvData.headers.push(h.csvTitle);
    });
    table.rows.forEach(row => {
      const ar = [];
      columns.forEach(col => {
        ar.push((row.csv && row.csv[col]) ? row.csv[col] : (row.cells && row.cells[col]) ? this.toValidCsvString(row.cells[col].toString()) : '');
      });
      csvData.data.push(ar);
    })
    return this.createDownloadLink(csvData);
  }

  toValidCsvString(value: string): string {
    if (!value) { return value; }
    return value.replace(/,/g, ' ').replace(/#/g, ' ');
  }

  createDownloadLink(csv: CsvData): string {
    if (!csv.headers || !csv.headers.length) { return undefined; }
    let link = "data:text/csv;charset=utf-8," +
      csv.headers.map(x => { return "\"" + x + "\"" }).join(',') + '\n' +
      csv.data.map(e => e.join(',')).join('\n');
    return link;
  }

  downloadCsv(fileName: string, table: TableModel): void {
    const encodedUri = this.createLinkFromTable(table);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  }

  readHeaders(file: any): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      this.readFile(0, 1024, '', file,
        (str: string) => {
          const arr = str.split('\n');
          if (arr.length > 1) {
            const headers = arr[0].split(',').map(x => {
              return x.trim().replace(/"/g, '')
            });
            resolve(headers);
          }
          return arr.length < 2;
        },
        (str: string) => {
          reject(str);
          //resolve([]);
        },
        (e: any) => {
          reject(e);
        }
      );
    });
  }

  isCsv(fileName: string): boolean {
    if (!fileName) { return false; }
    return fileName.toLowerCase().endsWith('.csv');
  }

  validate(file: any): Promise<ValidationFileMessage> {
    return new Promise<ValidationFileMessage>((resolve, reject) => {
      if (!this.isCsv(file.name)) {
        resolve(ValidationFileMessage.Success);
        return;
      }
      this.readHeaders(file).then(headers => {
        if (!headers || !headers.length) {
          resolve(ValidationFileMessage.HeaderEmptyError);
          return;
        }
        const dict = {};
        let isError = false;
        headers.forEach(x => {
          if (!x.trim()) {
            isError = true;
            resolve(ValidationFileMessage.HeaderEmptyError);
            return;
          }
          if (x.trim().toLowerCase() === 'null') {
            isError = true;
            resolve(ValidationFileMessage.NullOnHeadersError);
            return;
          }
          // if (!this.validateSymbol(x)) {
          //   isError = true;
          //   resolve(ValidationFileMessage.NoHebrewHeaders);
          //   return;
          // }
          if (dict[x]) {
            isError = true;
            resolve(ValidationFileMessage.UniquenessOfHeadersError);
            return;
          }
          dict[x] = true;
        });

        if (!isError) {
          resolve(ValidationFileMessage.Success);
        }

      }).catch(e => {
        if (e === '') {

          resolve(ValidationFileMessage.FileEmpty);
        } else {
          resolve(ValidationFileMessage.NoRows);
        }
      });
    });
  }

  validateFileExtention(inputFile: any, extentions: Array<string>): boolean {
    if (!inputFile || !inputFile.value) { return true; }
    if (!extentions) { return false; }
    const arr = inputFile.value.split('.');
    const ext = arr[arr.length - 1].toLowerCase().trim();
    return !!extentions.find(x => x.trim().toLowerCase() === ext);
  }

  validateFileName(inputFile: any): boolean {
    if (!inputFile || !inputFile.value) { return true; }
    let arr = inputFile.value.split('.');
    if (!arr.length || !arr[0] || arr[0] === '' || arr[0].trim() === '') {
      return false;
    }
    arr = arr[0].split('\\');
    if (!arr.length || !arr[arr.length - 1] || arr[arr.length - 1] === '' || arr[arr.length - 1].trim() === '') {
      return false;
    }
    return true;
  }

  validateUtf8(file: any): boolean {
    if (!file) { return false; }
    return true;
  }

  validateFileSize(file: any, minSize: number, maxSize: number): boolean {
    if (!file) { return false; }
    return ((minSize < 0 || file.size > minSize) && (maxSize < 0 || file.size < maxSize));
  }

  validateFileEmpty(file: any): boolean {
    if (!file) { return false; }
    return file.size > 0;
  }

  detectEncoding(file: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.isCsv(file.name)) {
        resolve('UTF8');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (!!e.target.error) {
          reject();
        } else {
          const codes = new Uint8Array(e.target.result as ArrayBuffer);
          const detectedEncoding = Encoding.detect(codes);
          resolve(detectedEncoding);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  readFile(offset: number, chunkSize: number, buffer: string, file: any, callBack: any, endReadCallback: any, errorCallback: any): void {
    if (offset >= file.size) {
      endReadCallback(buffer);
      return;
    }
    this.readBlock(offset, chunkSize + offset, file).then((res: string) => {
      buffer += res;
      if (callBack(buffer)) {
        this.readFile(offset + chunkSize, chunkSize, buffer, file, callBack, endReadCallback, errorCallback);
      }
    }).catch((error: any) => {
      errorCallback(error);
    })
  }

  readBlock(offset: number, length: number, file: any): Promise<string> {
    const reader = new FileReader();
    const blob = file.slice(offset, length + offset);
    return new Promise<string>((resolve, reject) => {
      reader.onload = (evt: any) => {
        if (!!evt.target.error) {
          reject(evt.target.error);
        } else {
          resolve(reader.result.toString());
        }
      };
      reader.readAsText(blob);
    });
  }

  validateMaxSize(file: any, maxSize: number): boolean {
    return (file.size / 1000000 <= maxSize);
  }

  validateSymbol(str: string, expr: string = undefined): boolean {
    return /^[A-z0-9\s-_\' *&$<>%~@+!#\/|,^{}()[\]]+$/g.test(str);
  }
}

