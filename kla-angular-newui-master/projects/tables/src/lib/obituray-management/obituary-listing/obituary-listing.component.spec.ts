import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObituaryListingComponent } from './obituary-listing.component';

describe('ObituaryListingComponent', () => {
  let component: ObituaryListingComponent;
  let fixture: ComponentFixture<ObituaryListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObituaryListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObituaryListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
