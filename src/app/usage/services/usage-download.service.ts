import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { UsageReportParams } from '../models/usage-request';
import { UsageRequestService } from './usage-request.service';
import { DateService } from '@app/core-api';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface DownloadData {
  pageName: string;
  fileName: string;
  charts?: Array<any>;
  data?: any;
  printUsers?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class UsageDownloadService {
  toCSV: any = () => { };
  toPDF: any = () => { };

  constructor(
    private usageRequestService: UsageRequestService,
    private dateService: DateService
  ) { }

  get pdfParams(): any {
    return [[
      {
        text: `From Date: ${this.usageRequestService.usageRequest.fromDate}`
      },
      {
        text: `To Date: ${this.usageRequestService.usageRequest.toDate}`
      },
      {
        text: `Include Admin Users: ${this.usageRequestService.usageRequest.includeAdmin ? 'Yes' : 'No'}`
      },
      {
        text: `Environmet: ${this.usageRequestService.getEnironment().name}`
      }
    ], [
      {
        text: `Include Admin Users: ${this.usageRequestService.usageRequest.includeAdmin ? 'Yes' : 'No'}`
      },
      {
        text: `Environmet: ${this.usageRequestService.getEnironment().name}`
      }]
    ];
  }

  downloadPDF(downloadData: DownloadData, paramIndex: number = 0): void {
    const documentDefinition: any = {
      header: this.createTop(downloadData),
      content: [
        {
          columns: [
            this.pdfParams[paramIndex]
          ]
        }
      ],
      footer: this.createFooter(downloadData)
    };

    this.addUsers(documentDefinition, downloadData);

    if (downloadData.charts) {
      downloadData.charts.forEach((chart: any, index: number) => {
        if (chart.svg) {
          if (chart.svg.title) {
            documentDefinition.content.push({
              text: chart.svg.title,
              bold: true,
              fontSize: 12,
              alignment: 'center',
              margin: [20, 20, 20, 20]
            });
          }
          if (chart.svg.image) {
            documentDefinition.content.push({
              svg: chart.svg.image
            });
          }
        }
        const chartTable = this.createTable(chart);
        if (chartTable) {
          documentDefinition.content.push({
            table: chartTable
          });
        }
      });
    }

    //document.write(JSON.stringify(documentDefinition))
    pdfMake.createPdf(documentDefinition).open();
    //pdfMake.createPdf(documentDefinition).download(`${downloadData.fileName}.pdf`);
  }

  private createTable(data: any): any {
    if (!data) { return undefined; }
    if (!data.headers) { return undefined; }
    if (!data.body) { return undefined; }
    const res: any = { headerRows: 1, width: [], body: [] }
    res.width = data.headers.map((x: any) => 'auto');
    res.body.push(data.headers.map((h: any) => {
      return { text: h, bold: true, color: 'black' };
    }));
    data.body.forEach((row: any) => {
      res.body.push(row);
    })

    return res;
  }

  private createTop(downloadData: DownloadData): any {
    return {
      text: downloadData.pageName,
      bold: true,
      fontSize: 20,
      alignment: 'center',
      margin: [0, 10, 0, 10]
    };
  }

  private createFooter(downloadData: DownloadData): any {
    const date = new Date();
    return {
      text: this.dateService.formatDate(date),
      bold: true,
      fontSize: 12,
      alignment: 'center',
      margin: [0, 10, 0, 10]
    };
  }

  private addUsers(documentDefinition: any, downloadData: DownloadData): void {
    if (!downloadData.printUsers) { return; }
    if (!this.usageRequestService.usageRequest.users || !this.usageRequestService.usageRequest.users.length) { return; }
    documentDefinition.content.push({
      text: 'Users',
      bold: true,
      fontSize: 12,
      alignment: 'center',
      margin: [20, 20, 20, 20]
    });
    const table: any = { headerRows: 1, width: ['auto'], body: [] }
    table.body.push([{ text: 'Login', bold: true, color: 'black' }]);
    this.usageRequestService.usageRequest.users.forEach((user: any) => {
      const u = this.usageRequestService.getUserById(user);
      if (u) {
        table.body.push([{ text: u.login, bold: true, color: 'black' }]);
      }
    })
    documentDefinition.content.push({
      table: table
    });
  }

  downloadCSV(data: any): void {

  }
}
