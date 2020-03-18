import { Component } from '@angular/core';
import { ComponentService } from './core-api';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('openCloseContent', [
      state('open', style({ width: 'auto' })),
      state('closed', style({ width: '100%' })),
      transition('open => closed', [animate('.2s')]),
      transition('closed => open', [animate('.2s')])
    ]),
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
}
