import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotFileViewComponent } from './ballot-file-view.component';

describe('BallotFileViewComponent', () => {
  let component: BallotFileViewComponent;
  let fixture: ComponentFixture<BallotFileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotFileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
