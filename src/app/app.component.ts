import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ComponentService, TranslateService, BaseSibscriber } from './core-api';
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
export class AppComponent extends BaseSibscriber implements AfterViewInit {

  @ViewChild('appMenu', { static: true }) appMenu: ElementRef;
  @ViewChild('firstTd', { static: true }) firstTd: ElementRef;  
  title = 'mdclone-mainapp-ui';
  constructor(public componentService: ComponentService) {
    super();
    super.add(
      this.componentService.onToggleMenu.subscribe(() => {
        this.setSize();
      }));
  }

  appWidth = '100%';
  overflowX = 'visible';

  animationStarted(event: any): void {
    this.overflowX = 'visible';
    this.appWidth = '100%';
  }

  ngAfterViewInit(): void {
    //this.setSize();
  }

  setSize(delay = 100): void {
    setTimeout(() => {
      this.overflowX = 'hidden';
      this.appWidth = `${window.innerWidth - 40 - ComponentService.getRect(this.appMenu).width}px`;
    }, delay);
  }

  animationDone(event: any): void {
    this.componentService.toggleMenu();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setSize(0);
  }
}
