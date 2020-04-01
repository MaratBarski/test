import { Component, Input } from '@angular/core';

export interface EmptyState {
  title: string;
  subTitle: string;
  image: string;
}

@Component({
  selector: 'mdc-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent {
  @Input() emptyState: EmptyState;
}
