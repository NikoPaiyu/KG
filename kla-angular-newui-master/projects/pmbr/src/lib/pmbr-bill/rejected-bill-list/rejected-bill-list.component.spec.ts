import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedBillListComponent } from './rejected-bill-list.component';

describe('RejectedBillListComponent', () => {
  let component: RejectedBillListComponent;
  let fixture: ComponentFixture<RejectedBillListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectedBillListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
