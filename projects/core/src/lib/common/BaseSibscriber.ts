import { OnDestroy } from '@angular/core';

export class BaseSibscriber implements OnDestroy {
    private subscribers: Array<any> = [];

    add(subscription: any): void {
        this.subscribers.push(subscription);
    }

    ngOnDestroy(): void {
        this.subscribers.forEach(s => s.unsubscribe());
    }
}