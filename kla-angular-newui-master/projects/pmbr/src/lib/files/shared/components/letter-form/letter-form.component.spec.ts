import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterFormComponent } from './letter-form.component';

describe('LetterFormComponent', () => {
  let component: LetterFormComponent;
  let fixture: ComponentFixture<LetterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
