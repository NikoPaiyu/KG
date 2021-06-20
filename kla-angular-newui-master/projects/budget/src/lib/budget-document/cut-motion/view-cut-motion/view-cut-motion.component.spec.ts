import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCutMotionComponent } from './view-cut-motion.component';

describe('ViewCutMotionComponent', () => {
  let component: ViewCutMotionComponent;
  let fixture: ComponentFixture<ViewCutMotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCutMotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCutMotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
