import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherDashboardComponent } from './voucher-dashboard.component';

describe('VoucherDashboardComponent', () => {
  let component: VoucherDashboardComponent;
  let fixture: ComponentFixture<VoucherDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
