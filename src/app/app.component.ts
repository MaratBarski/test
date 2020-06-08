import {Component, ViewChild, ElementRef, AfterViewInit, HostListener} from '@angular/core';
import {ComponentService, TranslateService, BaseSibscriber, animation, NavigationService} from '@appcore';
import {ConfigService} from './shared/services/config.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    animation.openClose
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  uiRoute = environment.uiRoute;
  constructor(
    public componentService: ComponentService,
    public configService: ConfigService
  ) {

  }
}
