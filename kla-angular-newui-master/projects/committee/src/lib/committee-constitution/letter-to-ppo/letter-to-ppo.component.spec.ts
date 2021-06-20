import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterToPpoComponent } from './letter-to-ppo.component';

describe('LetterToPpoComponent', () => {
  let component: LetterToPpoComponent;
  let fixture: ComponentFixture<LetterToPpoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterToPpoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterToPpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
