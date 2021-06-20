import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdgRequestListComponent } from './sdg-request-list.component';

describe('SdgRequestListComponent', () => {
  let component: SdgRequestListComponent;
  let fixture: ComponentFixture<SdgRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdgRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdgRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
