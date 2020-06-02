import { Injectable } from '@angular/core';
import { TableModel } from '../components/table/table.component';

export interface CsvData {
  headers: Array<string>;
  data?: Array<Array<any>>;
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
            }).filter(x => x !== '');
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

    // return new Promise((resolve, reject) => {
    //   let chunkSize = 4 * 1024;
    //   this.readBlock(0, chunkSize, file).then((res) => {
    //     try {
    //       const headers = res
    //         .split('\n')[0]
    //         .split(',')
    //         .map(x => {
    //           return x.trim().replace(/"/g, '')
    //         }).filter(x => x !== '');
    //       resolve(headers);
    //     } catch (error) {
    //       reject(error);
    //     }
    //   }).catch(e => {
    //     reject(e);
    //   });
    // });

    // const reader = new FileReader();
    // return new Promise((resolve, reject) => {
    //   reader.onload = function () {
    //     try {
    //       const headers = reader.result.toString()
    //         .split('\n')[0]
    //         .split(',')
    //         .map(x => {
    //           return x.trim().replace(/"/g, '')
    //         }).filter(x => x !== '');
    //       resolve(headers);
    //     } catch (e) {
    //       reject(e);
    //     }
    //   };
    //   try {
    //     reader.readAsText(file);
    //   } catch (e) {
    //     reject(e);
    //   }
    // });
  }

  validate(file: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.readHeaders(file).then(headers => {
        resolve(headers && headers.length > 0);
      }).catch(e => {
        resolve(false);
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
}

