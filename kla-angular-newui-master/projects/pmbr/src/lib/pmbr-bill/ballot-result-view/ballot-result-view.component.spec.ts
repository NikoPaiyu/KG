import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotResultViewComponent } from './ballot-result-view.component';

describe('BallotResultViewComponent', () => {
  let component: BallotResultViewComponent;
  let fixture: ComponentFixture<BallotResultViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotResultViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotResultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
