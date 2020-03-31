import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { ChartBarComponent, Bar } from '@app/core-api';

@Component({
  selector: 'md-usage-report',
  templateUrl: './usage-report.component.html',
  styleUrls: ['./usage-report.component.scss']
})
export class UsageReportComponent implements OnInit {

  dataSet: Array<Bar>;

  @ViewChild('chartCmp', { read: ViewContainerRef, static: true }) chartCmp: ViewContainerRef;
  @Input() pageTitle = 'Monthly General Usage';
  @Input() pageTooltip = 'Each bar represents the monthly number of users who created at least one new query or downloaded a file.';
  current = 0;
  components = [
    { type: ChartBarComponent, name: 'personaldata' }
  ];

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.dataSet = [
      {
        xlabel: 'NOV-19',
        bars: [
          {
            label: 'java',
            backgroundColor: '#5B9BD5',
            borderColor: 'green',
            textColor: 'white',
            value: 20
          },
          {
            label: 'java',
            backgroundColor: '#002060',
            textColor: 'white',
            borderColor: 'green',
            value: 50
          },
          {
            label: 'java',
            backgroundColor: '#5B9BD5',
            textColor: 'white',
            borderColor: 'green',
            value: 50
          },
          {
            label: 'java',
            backgroundColor: 'green',
            borderColor: 'green',
            value: 50
          }
        ]
      },
      {
        xlabel: 'DEC-19',
        bars: [
          {
            label: 'java',
            backgroundColor: 'blue',
            borderColor: 'green',
            value: 50
          },
          {
            label: 'java',
            backgroundColor: 'red',
            borderColor: 'green',
            value: 50
          }
        ]
      },
      {
        xlabel: 'JAN-20',
        bars: [
          {
            label: 'test',
            backgroundColor: '#5B9BD5',
            borderColor: 'green',
            value: 43
          },
          {
            label: 'test',
            backgroundColor: 'brown',
            borderColor: 'green',
            value: 57
          }
        ]
      },
      {
        xlabel: 'FEB-20',
        bars: [
          {
            label: 'c++',
            backgroundColor: 'blue',
            borderColor: 'green',
            value: 30
          },
          {
            label: 'node',
            backgroundColor: '#b00',
            borderColor: 'green',
            value: 21
          }
        ]
      },
      {
        xlabel: 'MAR-20',
        bars: [
          {
            label: 'javascript',
            backgroundColor: 'blue',
            borderColor: 'green',
            value: 40
          },
          {
            label: 'node',
            backgroundColor: '#b00',
            borderColor: 'green',
            value: 20
          }
        ]
      },
      {
        xlabel: 'APR-20',
        bars: [
          {
            label: 'javascript',
            backgroundColor: 'blue',
            borderColor: 'green',
            value: 40
          },
          {
            label: 'node',
            backgroundColor: '#b00',
            borderColor: 'green',
            value: 20
          }
        ]
      },
      {
        xlabel: 'MAY-20',
        bars: [
          {
            label: 'javascript',
            backgroundColor: 'blue',
            borderColor: 'green',
            value: 40
          },
          {
            label: 'node',
            backgroundColor: '#b00',
            borderColor: 'green',
            value: 20
          },
          {
            label: 'node',
            backgroundColor: 'yellow',
            borderColor: 'yellow',
            value: 20
          },
          {
            label: 'node',
            backgroundColor: 'orange',
            borderColor: 'yellow',
            value: 49
          },
        ]
      }
    ];
    //this.loadComponent();
  }

  loadComponent(): void {
    const adItem = this.components[this.current].type;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem);
    this.chartCmp.clear();
    const componentRef = this.chartCmp.createComponent(componentFactory);
    componentRef.instance.dataSet = this.dataSet;
    // this.clientEdit = {
    //   client: <IClientEdit>componentRef.instance,
    //   name: this.components[this.current].name
    // };
    // this.clientEdit.client.client = this.client;
  }



}
