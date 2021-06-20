import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernorsAddressFileViewComponent } from './governors-address-file-view.component';

describe('GovernorsAddressFileViewComponent', () => {
  let component: GovernorsAddressFileViewComponent;
  let fixture: ComponentFixture<GovernorsAddressFileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernorsAddressFileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernorsAddressFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
