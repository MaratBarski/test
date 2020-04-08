import { Input } from '@angular/core';
import { InfoPanel } from './usage-dashboard-info-panel/usage-dashboard-info-panel.component';

export abstract class UsageBase {
    responseData: any;
    @Input() set infoPanel(infoPanel: InfoPanel) {
        this._infoPanel = infoPanel;
        this.createReport();
    }
    get infoPanel(): InfoPanel { return this._infoPanel; }
    private _infoPanel: InfoPanel;
    abstract createReport(): void;
}
