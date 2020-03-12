import { OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';


export class BaseSibscriber implements OnDestroy {
    private subscribers: Array<any> = [];

    get onAfterDestroy(): Observable<any> {
        return this._onAfterDestroy.asObservable();
    }

    private _onAfterDestroy = new Subject();

    add(subscription: any): void {
        this.subscribers.push(subscription);
    }

    ngOnDestroy(): void {
        this._onAfterDestroy.next();
        this.subscribers.forEach(s => s.unsubscribe());
    }
}