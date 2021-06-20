import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateElectionNominationComponent } from './create-election-nomination.component';

describe('CreateElectionNominationComponent', () => {
  let component: CreateElectionNominationComponent;
  let fixture: ComponentFixture<CreateElectionNominationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateElectionNominationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateElectionNominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
