import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ComponentService, TranslateService, BaseSibscriber, animation } from './core-api';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    animation.openClose
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
