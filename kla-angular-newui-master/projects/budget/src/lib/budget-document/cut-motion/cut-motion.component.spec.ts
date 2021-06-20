import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CutMotionComponent } from './cut-motion.component';

describe('CutMotionComponent', () => {
  let component: CutMotionComponent;
  let fixture: ComponentFixture<CutMotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CutMotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CutMotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
