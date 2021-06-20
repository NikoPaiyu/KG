import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotingComponent } from './balloting.component';

describe('BallotingComponent', () => {
  let component: BallotingComponent;
  let fixture: ComponentFixture<BallotingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
