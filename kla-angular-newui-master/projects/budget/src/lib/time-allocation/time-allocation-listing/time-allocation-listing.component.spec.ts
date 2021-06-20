import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeAllocationListingComponent } from './time-allocation-listing.component';

describe('TimeAllocationListingComponent', () => {
  let component: TimeAllocationListingComponent;
  let fixture: ComponentFixture<TimeAllocationListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeAllocationListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeAllocationListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
