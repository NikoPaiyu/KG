import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionMlaListingComponent } from './question-mla-listing.component';

describe('QuestionMlaListingComponent', () => {
  let component: QuestionMlaListingComponent;
  let fixture: ComponentFixture<QuestionMlaListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionMlaListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionMlaListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
