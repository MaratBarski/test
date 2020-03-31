import { Bar, BarPart } from './chart-bar';
import { Input, OnInit } from '@angular/core';
import { BaseChart } from './BaseChart';

export abstract class BaseChartBar extends BaseChart implements OnInit {
    
    @Input() backgroundColor = '#fff';
    @Input() dh = 100;
    @Input() dw = 100;

    @Input() set dataSet(dataSet: Array<Bar>) {
        setTimeout(() => {
            dataSet = JSON.parse(JSON.stringify(dataSet));
            this.updateDataset(dataSet);
            this._dataSet = dataSet;
            this.afterInit();
        }, 10);
    }

    rect: {
        width: number;
        height: number;
        y: number;
        x: number;
        top: number;
        left: number;
        bottom: number;
        right: number;
    };
    
    get width(): number { return this.rect ? this.rect.width : 0; }
    get height(): number { return this.rect ? this.rect.height : 0; }

    yKf = 1;
    xKf = 1;
    barWidth = 1;
    barSpace = 1;

    textPadding = 10;
    paddingTop = 20;
    paddingBottom = 50;
    paddingLeft = 100;
    paddingRight = 50;
    fontSize = 12;
    totalFontColor = 'black'

    get dataSet(): Array<Bar> {
        return this._dataSet;
    }

    private _dataSet: Array<Bar>;

    get chartHeight(): number { return this.height - this.paddingTop - this.paddingBottom };
    get chartWidth(): number { return this.width - this.paddingLeft - this.paddingRight };

    protected updateDataset(dataSet: Array<Bar>): void {
        if (!dataSet || !dataSet.length) { return; }
        let yMax = 0;
        dataSet.forEach((elm: Bar, index: number) => {
            elm.total = elm.bars.reduce((acc: number, cur: BarPart) => {
                cur.prev = acc;
                return acc + cur.value;
            }, 0);
            yMax = Math.max(yMax, elm.total);
        });
        this.yKf = this.chartHeight / yMax;
        this.xKf = this.chartWidth / yMax;
        this.barWidth = (this.width / 2) / dataSet.length;
        this.barSpace = (this.width / 2) / dataSet.length;
    }

    ngOnInit() {
        setTimeout(() => {
            this.rect = this.svg.nativeElement.getBoundingClientRect();
        }, 1);
    }

    abstract afterInit(): void;
}