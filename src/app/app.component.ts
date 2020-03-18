import { Component } from '@angular/core';
import { ComponentService, TranslateService } from './core-api';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('openClose', [
      state('open', style({
        width: '305px',
        left: '0px',
        backgroundColor: '#0D1E42'
      })),
      state('closed', style({
        width: '0px',
        left: '-306px',
        backgroundColor: '#fff'
      })),
      transition('open => closed', [animate('.3s')]),
      transition('closed => open', [animate('.3s')])
    ])
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mdclone-mainapp-ui';
  constructor(public componentService: ComponentService) { }

  animationStarted(event: any): void {
  }

  animationDone(event: any): void {
    this.componentService.toggleMenu();
  }
}
