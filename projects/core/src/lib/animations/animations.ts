import { trigger, state, style, transition, animate, group } from '@angular/animations';

export enum SlideInOutState {
  in = 'in',
  out = 'out'
}

export const animation = {
  rotateRight90: trigger('rotatedState', [
    state('default', style({ transform: 'rotate(0)' })),
    state('rotated', style({ transform: 'rotate(-90deg)' })),
    transition('rotated => default', animate('500ms ease-out')),
    transition('default => rotated', animate('500ms ease-in'))
  ]),
  slideUpDown: trigger('slideInOut', [
    state('in', style({
      'max-height': '1000px', 'opacity': '1', 'visibility': 'visible'
    })),
    state('out', style({
      'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
    })),
    transition('in => out', [group([
      animate('300ms ease-in-out', style({
        'max-height': '0px'
      })),
      animate('300ms ease-in-out', style({
        'opacity': '0'
      })),
      animate('500ms ease-in-out', style({
        'visibility': 'hidden'
      }))
    ]
    )]),
    transition('out => in', [group([
      animate('1ms ease-in-out', style({
        'visibility': 'visible'
      })),
      animate('300ms ease-in-out', style({
        'max-height': '1000px'
      })),
      animate('300ms ease-in-out', style({
        'opacity': '1'
      }))
    ]
    )])
  ])
};
