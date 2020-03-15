import { Component, Input } from '@angular/core';

@Component({
  selector: 'mdc-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent {
  @Input() state = 0;
  @Input() showMatch = false;
  @Input() css = 'progress_green';//progress_red,progress_yellow
}
