import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClmTypeSwitcherComponent } from './clm-type-switcher.component';

describe('ClmTypeSwitcherComponent', () => {
  let component: ClmTypeSwitcherComponent;
  let fixture: ComponentFixture<ClmTypeSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClmTypeSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClmTypeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
