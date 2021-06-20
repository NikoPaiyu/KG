import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionBallotListComponent } from './resolution-ballot-list.component';

describe('ResolutionBallotListComponent', () => {
  let component: ResolutionBallotListComponent;
  let fixture: ComponentFixture<ResolutionBallotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionBallotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionBallotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
