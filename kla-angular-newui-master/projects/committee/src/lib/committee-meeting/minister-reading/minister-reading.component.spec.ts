import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisterReadingComponent } from './minister-reading.component';

describe('MinisterReadingComponent', () => {
  let component: MinisterReadingComponent;
  let fixture: ComponentFixture<MinisterReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinisterReadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinisterReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
