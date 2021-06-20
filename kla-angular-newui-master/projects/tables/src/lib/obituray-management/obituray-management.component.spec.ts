import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObiturayManagementComponent } from './obituray-management.component';

describe('ObiturayManagementComponent', () => {
  let component: ObiturayManagementComponent;
  let fixture: ComponentFixture<ObiturayManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObiturayManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObiturayManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
