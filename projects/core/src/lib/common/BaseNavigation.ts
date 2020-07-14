import { OnDestroy } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { BaseSibscriber } from './BaseSibscriber';


export abstract class BaseNavigation extends BaseSibscriber implements OnDestroy {

    constructor(protected navigationService: NavigationService) {
        super();
    }

    ngOnDestroy(): void {
        this.navigationService.beforeNavigate = undefined;
        super.ngOnDestroy();
    }
}