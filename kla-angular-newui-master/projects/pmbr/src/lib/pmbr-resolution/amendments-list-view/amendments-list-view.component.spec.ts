import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentsListViewComponent } from './amendments-list-view.component';

describe('AmendmentsListViewComponent', () => {
  let component: AmendmentsListViewComponent;
  let fixture: ComponentFixture<AmendmentsListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendmentsListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
