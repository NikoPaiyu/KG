import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberBallotListComponent } from './member-ballot-list.component';

describe('MemberBallotListComponent', () => {
  let component: MemberBallotListComponent;
  let fixture: ComponentFixture<MemberBallotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberBallotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberBallotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
