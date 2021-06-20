import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAssemblyComponent } from './manage-assembly.component';

describe('ManageAssemblyComponent', () => {
  let component: ManageAssemblyComponent;
  let fixture: ComponentFixture<ManageAssemblyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAssemblyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAssemblyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
