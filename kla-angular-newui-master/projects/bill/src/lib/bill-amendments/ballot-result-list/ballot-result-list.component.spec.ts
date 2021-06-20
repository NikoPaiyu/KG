import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotResultListComponent } from './ballot-result-list.component';

describe('BallotResultListComponent', () => {
  let component: BallotResultListComponent;
  let fixture: ComponentFixture<BallotResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotResultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
