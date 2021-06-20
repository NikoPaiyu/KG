import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardtoSelectCommitteeComponent } from './forwardto-select-committee.component';

describe('ForwardtoSelectCommitteeComponent', () => {
  let component: ForwardtoSelectCommitteeComponent;
  let fixture: ComponentFixture<ForwardtoSelectCommitteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardtoSelectCommitteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardtoSelectCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
