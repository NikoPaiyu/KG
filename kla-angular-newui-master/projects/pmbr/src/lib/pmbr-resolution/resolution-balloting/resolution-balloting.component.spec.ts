import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionBallotingComponent } from './resolution-balloting.component';

describe('ResolutionBallotingComponent', () => {
  let component: ResolutionBallotingComponent;
  let fixture: ComponentFixture<ResolutionBallotingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionBallotingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionBallotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
