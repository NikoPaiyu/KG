import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotFileComponent } from './ballot-file.component';

describe('BallotFileComponent', () => {
  let component: BallotFileComponent;
  let fixture: ComponentFixture<BallotFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
