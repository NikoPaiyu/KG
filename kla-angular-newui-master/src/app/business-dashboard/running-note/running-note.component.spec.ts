import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningNoteComponent } from './running-note.component';

describe('RunningNoteComponent', () => {
  let component: RunningNoteComponent;
  let fixture: ComponentFixture<RunningNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
