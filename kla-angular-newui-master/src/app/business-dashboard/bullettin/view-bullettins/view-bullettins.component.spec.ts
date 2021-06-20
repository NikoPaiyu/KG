import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBullettinsComponent } from './view-bullettins.component';

describe('ViewBullettinsComponent', () => {
  let component: ViewBullettinsComponent;
  let fixture: ComponentFixture<ViewBullettinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBullettinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBullettinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
