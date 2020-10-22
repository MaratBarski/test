import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'mdc-progress-match',
  templateUrl: './progress-match.component.html',
  styleUrls: ['./progress-match.component.css'],
})
export class ProgressMatchComponent {
  @Input() percentage;
  @Input() reverseColor = false;
  @Input() withoutColorRange = false;
}
