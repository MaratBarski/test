import { Component } from '@angular/core';
import { ComponentService } from '@app/core-api';
import { UsageService, } from '@app/usage/services/usage.service';
import { ChartService } from '@app/usage/services/chart.service';
import { UsageBase } from '../UsageBase';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageDownloadService } from '@app/usage/services/usage-download.service';

@Component({
  selector: 'md-usage-report',
  templateUrl: './usage-report.component.html',
  styleUrls: ['./usage-report.component.scss']
})
export class UsageReportComponent extends UsageBase {

  view: undefined;// any[] = [600, 400];
  showXAxis = true;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = '';
  yAxisLabel = 'Sales';
  showYAxisLabel = true;
  timeline = true;

  colorScheme = {
    domain: ['#002060']
  };


  constructor(
    private usageDownloadService: UsageDownloadService,
    protected componentService: ComponentService,
    protected usageService: UsageService,
    protected chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();
    this.usageDownloadService.toCSV = this.toCSV;
    this.usageDownloadService.toPDF = this.toPDF;
  }

  private toCSV(): any {
    return 'csv';
  }

  private toPDF(): any {
    return {
      content: [
        {
          text: 'test',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            [{
              text: 'fffffffff',
              style: 'name'
            },
            {
              text: 'eeeeeee'
            },
            {
              text: 'Email : ' + 'emeail',
            },
            {
              text: 'Contant No :',
            },
            {
              text: 'GitHub: ',
              link: 'link',
              color: 'blue',
            }
            ],
            // [
            //   {
            //     image: '/assets/',
            //     width: 75,
            //     alignment: 'right'
            //   }
            // ]
          ]
        },
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],
            body: [
              ['First', 'Second', 'Third', 'The last one'],
              ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
              [{ text: 'Bold value', bold: true, color: 'red' }, 'Val 2', 'Val 3', 'Val 4']
            ]
          }
        }
      ]
    };
  }

  createReport(): void {
    super.responseData = this.chartService.getGeneralUsage();
  }
}

//https://swimlane.gitbook.io/ngx-charts/v/docs-test/examples/bar-charts/horizontal-bar-chart
