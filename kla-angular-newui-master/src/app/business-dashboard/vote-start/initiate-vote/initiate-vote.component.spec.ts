import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateVoteComponent } from './initiate-vote.component';

describe('InitiateVoteComponent', () => {
  let component: InitiateVoteComponent;
  let fixture: ComponentFixture<InitiateVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiateVoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
