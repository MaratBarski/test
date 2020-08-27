import { OnInit, OnDestroy } from '@angular/core';
import { ComponentService, BaseSibscriber } from '@app/core-api';
import { UsageRequestService } from '../services/usage-request.service';

export abstract class UsageBase extends BaseSibscriber implements OnInit, OnDestroy {
    dataSourceReady: any = () => { };
    set responseData(responseData: any) {
        this._responseData = responseData;
        super.add(
            this._responseData.subscribe(res => {
                this.dataSource = res.data;
                this.reinitData();
                if (this.dataSourceReady) {
                    this.dataSourceReady();
                }
            })
        );
    }
    get responseData(): any {
        return this._responseData;
    }
    private _responseData: any;
    dataSource: any;
    abstract createReport(): void;
    protected abstract get componentService(): ComponentService;
    public abstract get usageRequestService(): UsageRequestService;

    reinitData(): void {
        if (typeof (this.dataSource) === 'string') {
            this.dataSource = this.usageRequestService.createData(this.dataSource);
        }
        else if (Array.isArray(this.dataSource)) {
            this.dataSource = [...this.dataSource];
        } else {
            this.dataSource = { ...this.dataSource };
        }
    }

    ngOnInit(): void {
        this.createReport();
        super.add(this.componentService.onSideBarToggle.subscribe((flag: boolean) => {
            //this.createReport();
            this.reinitData();
        }));
        super.add(
            this.usageRequestService.onChange.subscribe(() => {
                this.createReport();
            })
        );
        super.add(
            this.usageRequestService.onIncludeAdmin.subscribe(() => {
                //this.reinitData();
                this.createReport();
            })
        )
    }
}
