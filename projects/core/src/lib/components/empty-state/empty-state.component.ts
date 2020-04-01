import { Component, Input } from '@angular/core';

export interface EmptyState {
  title?: string;
  subTitle?: string;
  image?: string;
}

export const DefaultEmptyState = (): EmptyState => {
  return {
    title: 'Not a part of a component yet.',
    subTitle: 'Try using the filters or search different keywords',
    image: 'nodata.png'
  }
}

@Component({
  selector: 'mdc-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent {
  @Input() emptyState: EmptyState;
}
