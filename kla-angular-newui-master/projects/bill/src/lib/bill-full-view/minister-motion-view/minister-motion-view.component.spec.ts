import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisterMotionViewComponent } from './minister-motion-view.component';

describe('MinisterMotionViewComponent', () => {
  let component: MinisterMotionViewComponent;
  let fixture: ComponentFixture<MinisterMotionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinisterMotionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinisterMotionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
