import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCullingAssuranceComponent } from './question-culling-assurance.component';

describe('QuestionCullingAssuranceComponent', () => {
  let component: QuestionCullingAssuranceComponent;
  let fixture: ComponentFixture<QuestionCullingAssuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionCullingAssuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCullingAssuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
