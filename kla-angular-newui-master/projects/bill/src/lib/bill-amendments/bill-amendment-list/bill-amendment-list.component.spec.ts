import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAmendmentListComponent } from './bill-amendment-list.component';

describe('BillAmendmentListComponent', () => {
  let component: BillAmendmentListComponent;
  let fixture: ComponentFixture<BillAmendmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillAmendmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillAmendmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
