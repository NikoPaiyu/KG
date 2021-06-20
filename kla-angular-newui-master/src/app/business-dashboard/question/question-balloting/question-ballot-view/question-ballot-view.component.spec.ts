import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBallotViewComponent } from './question-ballot-view.component';

describe('QuestionMlaListingComponent', () => {
  let component: QuestionBallotViewComponent;
  let fixture: ComponentFixture<QuestionBallotViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionBallotViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBallotViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
