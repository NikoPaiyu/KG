import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillResponsesComponent } from './bill-responses.component';

describe('BillResponsesComponent', () => {
  let component: BillResponsesComponent;
  let fixture: ComponentFixture<BillResponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillResponsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
