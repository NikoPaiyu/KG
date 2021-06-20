import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryNoteDashboardComponent } from './delivery-note-dashboard.component';

describe('DeliveryNoteDashboardComponent', () => {
  let component: DeliveryNoteDashboardComponent;
  let fixture: ComponentFixture<DeliveryNoteDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryNoteDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryNoteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
