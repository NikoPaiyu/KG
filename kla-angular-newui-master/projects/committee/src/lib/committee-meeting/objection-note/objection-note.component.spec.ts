import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionNoteComponent } from './objection-note.component';

describe('ObjectionNoteComponent', () => {
  let component: ObjectionNoteComponent;
  let fixture: ComponentFixture<ObjectionNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectionNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectionNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
