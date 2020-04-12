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
    return [
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
    ];
  }

  downloadPDF(downloadData: DownloadData): void {

    const documentDefinition: any = {
      header: this.createTop(downloadData),
      content: [
        {
          columns: [
            this.pdfParams
          ]
        }
      ],
      footer: this.createFooter(downloadData)
    };

    if (downloadData.charts) {
      downloadData.charts.forEach((chart: any, index: number) => {
        documentDefinition.content.push({
          text: chart.svg.title,
          bold: true,
          fontSize: 12,
          alignment: 'center',
          margin: [20, 20, 20, 20]
        });
        documentDefinition.content.push({
          svg: chart.svg.image
        });
        const chartTable = this.createTable(chart);
        if (chartTable) {
          documentDefinition.content.push({
            table: chartTable
          });
        }
      });
    }

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

  downloadCSV(data: any): void {

  }
}
