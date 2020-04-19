import { OnDestroy } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';


export abstract class BaseSibscriber implements OnDestroy {
    private subscribers: Array<Subscription> = [];

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