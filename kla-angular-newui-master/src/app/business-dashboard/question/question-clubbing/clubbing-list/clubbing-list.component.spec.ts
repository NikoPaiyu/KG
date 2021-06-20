import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionClubbingListComponent } from './clubbing-list.component';

describe('QuestionClubbingListComponent', () => {
  let component: QuestionClubbingListComponent;
  let fixture: ComponentFixture<QuestionClubbingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionClubbingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionClubbingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
