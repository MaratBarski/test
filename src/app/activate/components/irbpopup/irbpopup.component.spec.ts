import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IRBPopupComponent } from './irbpopup.component';

describe('IRBPopupComponent', () => {
  let component: IRBPopupComponent;
  let fixture: ComponentFixture<IRBPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IRBPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IRBPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
