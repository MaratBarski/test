import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ComponentService } from '../../services/component.service';

export interface EmptyState {
  title?: string;
  subTitle?: string;
  image?: string;
}

export const DefaultEmptyState = (): EmptyState => {
  return {
    title: 'Nothing matches your search.',
    subTitle: 'Try using the filters or search different keywords',
    image: 'nodata.png'
  }
}

@Component({
  selector: 'mdc-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent implements OnInit, OnDestroy {
  @Input() emptyState: EmptyState = DefaultEmptyState();

  ngOnInit(): void {
    ComponentService.hideScroll(true);
  }

  ngOnDestroy(): void {
    ComponentService.hideScroll(false);
  }
}
