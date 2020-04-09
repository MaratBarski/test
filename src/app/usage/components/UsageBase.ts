import { Input, OnInit, OnDestroy } from '@angular/core';
import { InfoPanel } from './usage-dashboard-info-panel/usage-dashboard-info-panel.component';
import { ComponentService, BaseSibscriber } from '@app/core-api';

const GetDefaultInfoPanel = (): InfoPanel => {
    return {
        currentYear: 0,
        includeAdmin: false,
        environment: ''
    }
}
export abstract class UsageBase extends BaseSibscriber implements OnInit, OnDestroy {

    set responseData(responseData: any) {
        this._responseData = responseData;
        super.add(
            this._responseData.subscribe(res => {
                this.dataSource = res;
            })
        );
    }
    get responseData(): any {
        return this._responseData;
    }
    private _responseData: any;
    dataSource: any;
    @Input() set infoPanel(infoPanel: InfoPanel) {
        this._infoPanel = infoPanel ? infoPanel : GetDefaultInfoPanel()
        this.createReport();
    }
    get infoPanel(): InfoPanel { return this._infoPanel; }
    private _infoPanel: InfoPanel = GetDefaultInfoPanel();
    abstract createReport(): void;
    protected abstract get componentService(): ComponentService;

    ngOnInit(): void {
        super.add(this.componentService.onSideBarToggle.subscribe((flag: boolean) => {
            this.createReport();
        }));
    }
}
