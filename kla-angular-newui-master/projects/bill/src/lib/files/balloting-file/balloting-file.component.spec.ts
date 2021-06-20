import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotingFileComponent } from './balloting-file.component';

describe('BallotingFileComponent', () => {
  let component: BallotingFileComponent;
  let fixture: ComponentFixture<BallotingFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotingFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotingFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
