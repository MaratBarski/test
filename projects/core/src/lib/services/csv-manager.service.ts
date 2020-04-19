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
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function () {
        try {
          const headers = reader.result.toString()
            .split('\n')[0]
            .split(',')
            .map(x => {
              return x.trim().replace(/"/g, '')
            }).filter(x => x !== '');
          resolve(headers);
        } catch (e) {
          reject(e);
        }
      };
      try {
        reader.readAsText(file);
      } catch (e) {
        reject(e);
      }
    });
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
}

