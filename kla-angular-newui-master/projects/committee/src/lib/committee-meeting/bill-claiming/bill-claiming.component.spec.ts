import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillClaimingComponent } from './bill-claiming.component';

describe('BillClaimingComponent', () => {
  let component: BillClaimingComponent;
  let fixture: ComponentFixture<BillClaimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillClaimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillClaimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
