import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPortfolioAddComponent } from './question-portfolio-add.component';

describe('QuestionPortfolioAddComponent', () => {
  let component: QuestionPortfolioAddComponent;
  let fixture: ComponentFixture<QuestionPortfolioAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionPortfolioAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPortfolioAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
