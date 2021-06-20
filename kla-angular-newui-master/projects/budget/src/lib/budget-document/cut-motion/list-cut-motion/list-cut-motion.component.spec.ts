import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCutMotionComponent } from './list-cut-motion.component';

describe('ListCutMotionComponent', () => {
  let component: ListCutMotionComponent;
  let fixture: ComponentFixture<ListCutMotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCutMotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCutMotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
