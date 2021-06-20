import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberElectionDetailsComponent } from './member-election-details.component';

describe('MemberElectionDetailsComponent', () => {
  let component: MemberElectionDetailsComponent;
  let fixture: ComponentFixture<MemberElectionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberElectionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberElectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
