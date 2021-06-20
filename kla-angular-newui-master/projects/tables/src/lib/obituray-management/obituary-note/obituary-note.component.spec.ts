import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObituaryNoteComponent } from './obituary-note.component';

describe('ObituaryNoteComponent', () => {
  let component: ObituaryNoteComponent;
  let fixture: ComponentFixture<ObituaryNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObituaryNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObituaryNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
