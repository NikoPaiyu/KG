import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetSpeechComponent } from './budget-speech.component';

describe('BudgetSpeechComponent', () => {
  let component: BudgetSpeechComponent;
  let fixture: ComponentFixture<BudgetSpeechComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetSpeechComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetSpeechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
