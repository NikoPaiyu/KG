import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjIntoductionViewComponent } from './obj-intoduction-view.component';

describe('ObjIntoductionViewComponent', () => {
  let component: ObjIntoductionViewComponent;
  let fixture: ComponentFixture<ObjIntoductionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjIntoductionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjIntoductionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
