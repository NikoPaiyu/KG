import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotListViewComponent } from './ballot-list-view.component';

describe('BallotListViewComponent', () => {
  let component: BallotListViewComponent;
  let fixture: ComponentFixture<BallotListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
