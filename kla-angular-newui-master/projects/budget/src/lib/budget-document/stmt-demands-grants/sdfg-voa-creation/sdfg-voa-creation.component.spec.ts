import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdfgOrVOACreationComponent } from './sdfg-voa-creation.component';

describe('SdfgOrVOACreationComponent', () => {
  let component: SdfgOrVOACreationComponent;
  let fixture: ComponentFixture<SdfgOrVOACreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdfgOrVOACreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdfgOrVOACreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
