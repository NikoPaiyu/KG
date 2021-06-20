import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClauseByClauseNoticesForListComponent } from './clause-by-clause-notices-for-list.component';

describe('ClauseByClauseNoticesForListComponent', () => {
  let component: ClauseByClauseNoticesForListComponent;
  let fixture: ComponentFixture<ClauseByClauseNoticesForListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClauseByClauseNoticesForListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClauseByClauseNoticesForListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
