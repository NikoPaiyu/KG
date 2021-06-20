import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTimeAllocationBusinessComponent } from './pending-time-allocation-business.component';

describe('PendingTimeAllocationBusinessComponent', () => {
  let component: PendingTimeAllocationBusinessComponent;
  let fixture: ComponentFixture<PendingTimeAllocationBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingTimeAllocationBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingTimeAllocationBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
