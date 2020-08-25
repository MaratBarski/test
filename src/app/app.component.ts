import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ComponentService, TranslateService, BaseSibscriber, animation, NavigationService } from '@appcore';
import { ConfigService } from './shared/services/config.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    animation.openClose
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseSibscriber {
  uiRoute = environment.uiRoute;
  message;
  constructor(
    public componentService: ComponentService,
    public configService: ConfigService,
    private navigationService: NavigationService
  ) {
    super();
    super.add(this.navigationService.onNavigationStart.subscribe((url) => {
      this.isNavigating = true;
    }));
    super.add(this.navigationService.onNavigationEnd.subscribe((url) => {
      this.isNavigating = false;
    }));
  }

  isNavigating = false;

  send(msg) {
    this.message.next(msg);
  }
}
