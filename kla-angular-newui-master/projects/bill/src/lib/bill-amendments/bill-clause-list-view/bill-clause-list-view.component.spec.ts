import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillClauseListViewComponent } from './bill-clause-list-view.component';

describe('BillClauseListViewComponent', () => {
  let component: BillClauseListViewComponent;
  let fixture: ComponentFixture<BillClauseListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillClauseListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillClauseListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
