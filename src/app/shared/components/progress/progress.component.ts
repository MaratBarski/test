import { Component, Input } from '@angular/core';

@Component({
  selector: 'md-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  @Input() prefix = '~';
  @Input() set progress(w: number) {
    this._progress = Math.min(100, Math.max(0, w));
  }
  get progress(): number { return this._progress; }
  private _progress = 0;
}
