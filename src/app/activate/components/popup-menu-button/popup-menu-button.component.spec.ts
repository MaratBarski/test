import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMenuButtonComponent } from './popup-menu-button.component';

describe('PopupMenuButtonComponent', () => {
  let component: PopupMenuButtonComponent;
  let fixture: ComponentFixture<PopupMenuButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupMenuButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
