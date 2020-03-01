import { Component, Input } from '@angular/core';

@Component({
  selector: 'mdc-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent {
  @Input() path: string;
}
