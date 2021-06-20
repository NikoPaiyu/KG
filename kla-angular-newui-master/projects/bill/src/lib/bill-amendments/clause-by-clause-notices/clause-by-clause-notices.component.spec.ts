import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClauseByClauseNoticesComponent } from './clause-by-clause-notices.component';

describe('ClauseByClauseNoticesComponent', () => {
  let component: ClauseByClauseNoticesComponent;
  let fixture: ComponentFixture<ClauseByClauseNoticesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClauseByClauseNoticesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClauseByClauseNoticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
