import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionBallotViewComponent } from './resolution-ballot-view.component';

describe('ResolutionBallotViewComponent', () => {
  let component: ResolutionBallotViewComponent;
  let fixture: ComponentFixture<ResolutionBallotViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionBallotViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionBallotViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
