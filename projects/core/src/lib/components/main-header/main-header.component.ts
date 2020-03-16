import { Component, Input } from '@angular/core';
import { ComponentService } from '../../services/component.service';

@Component({
  selector: 'mdc-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent {

  @Input() organizationName = '';
  @Input() logo = '';
  showMenu = false;

  constructor(private componentService: ComponentService) { }

  displaySideMenu(): void {
    this.componentService.showSideMenu = !this.componentService.showSideMenu
  }
}
