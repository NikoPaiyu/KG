import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillResponseslistComponent } from './bill-responseslist.component';

describe('BillResponseslistComponent', () => {
  let component: BillResponseslistComponent;
  let fixture: ComponentFixture<BillResponseslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillResponseslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillResponseslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
