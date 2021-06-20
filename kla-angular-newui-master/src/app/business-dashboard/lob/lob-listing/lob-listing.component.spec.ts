import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobListingComponent } from './lob-listing.component';

describe('LobListingComponent', () => {
  let component: LobListingComponent;
  let fixture: ComponentFixture<LobListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
