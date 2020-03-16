import { Component } from '@angular/core';
import { ComponentService } from './core-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mdclone-mainapp-ui';
  constructor(private componentService: ComponentService) { }
}
