import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningnoteviewComponent } from './runningnoteview.component';

describe('RunningnoteviewComponent', () => {
  let component: RunningnoteviewComponent;
  let fixture: ComponentFixture<RunningnoteviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningnoteviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningnoteviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
