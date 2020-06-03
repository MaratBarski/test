import { Injectable } from '@angular/core';
import { TableModel } from '../components/table/table.component';

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
  OtherError = 'otherError'
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
        ar.push((row.csv && row.csv[col]) ? row.csv[col] : (row.cells && row.cells[col]) ? row.cells[col].toString() : '');
      });
      csvData.data.push(ar);
    })
    return this.createDownloadLink(csvData);
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

  validate(file: any): Promise<ValidationFileMessage> {
    return new Promise<ValidationFileMessage>((resolve, reject) => {
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
          if (!this.validateSymbol(x)) {
            isError = true;
            resolve(ValidationFileMessage.NoHebrewHeaders);
            return;
          }
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
        resolve(ValidationFileMessage.OtherError);
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

  validateFileSize(file: any, minSize: number, maxSize: number): boolean {
    if (!file) { return false; }
    return ((minSize < 0 || file.size > minSize) && (maxSize < 0 || file.size < maxSize));
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

  validateSymbol(str: string): boolean {
    for (let i = 0; i < str.length; i++) {
      const ch = str.charAt(i);
      if (ch >= 'a' && ch <= 'z') { continue }
      if (ch >= 'A' && ch <= 'Z') { continue }
      if (ch >= '0' && ch <= '9') { continue }
      if (ch === '_') { continue; }
      if (ch === '-') { continue; }
      if (ch === ' ') { continue; }
      return false;
    }
    return true;
  }
}
