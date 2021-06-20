import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClauseByClauseAllAmendmentsComponent } from './clause-by-clause-all-amendments.component';

describe('ClauseByClauseAllAmendmentsComponent', () => {
  let component: ClauseByClauseAllAmendmentsComponent;
  let fixture: ComponentFixture<ClauseByClauseAllAmendmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClauseByClauseAllAmendmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClauseByClauseAllAmendmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
