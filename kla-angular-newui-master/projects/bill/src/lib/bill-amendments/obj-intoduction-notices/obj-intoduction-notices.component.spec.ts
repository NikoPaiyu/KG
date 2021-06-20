import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjIntoductionNoticesComponent } from './obj-intoduction-notices.component';

describe('ObjIntoductionNoticesComponent', () => {
  let component: ObjIntoductionNoticesComponent;
  let fixture: ComponentFixture<ObjIntoductionNoticesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjIntoductionNoticesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjIntoductionNoticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
