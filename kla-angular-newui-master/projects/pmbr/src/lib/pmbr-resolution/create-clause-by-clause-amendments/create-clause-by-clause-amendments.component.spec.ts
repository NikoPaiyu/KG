import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClauseByClauseAmendmentsComponent } from './create-clause-by-clause-amendments.component';

describe('CreateClauseByClauseAmendmentsComponent', () => {
  let component: CreateClauseByClauseAmendmentsComponent;
  let fixture: ComponentFixture<CreateClauseByClauseAmendmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClauseByClauseAmendmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClauseByClauseAmendmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
