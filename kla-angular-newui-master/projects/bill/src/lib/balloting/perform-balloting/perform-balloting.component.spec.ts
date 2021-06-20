import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformBallotingComponent } from './perform-balloting.component';

describe('PerformBallotingComponent', () => {
  let component: PerformBallotingComponent;
  let fixture: ComponentFixture<PerformBallotingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformBallotingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformBallotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
