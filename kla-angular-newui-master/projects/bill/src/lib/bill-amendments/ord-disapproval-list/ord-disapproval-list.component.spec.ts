import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdDisapprovalListComponent } from './ord-disapproval-list.component';

describe('OrdDisapprovalListComponent', () => {
  let component: OrdDisapprovalListComponent;
  let fixture: ComponentFixture<OrdDisapprovalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdDisapprovalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdDisapprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
