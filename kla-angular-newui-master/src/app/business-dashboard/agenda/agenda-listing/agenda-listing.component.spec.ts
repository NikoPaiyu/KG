import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaListingComponent } from './agenda-listing.component';

describe('AgendaListingComponent', () => {
  let component: AgendaListingComponent;
  let fixture: ComponentFixture<AgendaListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
