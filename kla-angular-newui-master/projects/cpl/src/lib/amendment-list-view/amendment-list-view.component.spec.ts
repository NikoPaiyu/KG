import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentListViewComponent } from './amendment-list-view.component';

describe('AmendmentListViewComponent', () => {
  let component: AmendmentListViewComponent;
  let fixture: ComponentFixture<AmendmentListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendmentListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
