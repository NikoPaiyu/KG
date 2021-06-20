import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteStartComponent } from './vote-start.component';

describe('VoteStartComponent', () => {
  let component: VoteStartComponent;
  let fixture: ComponentFixture<VoteStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
