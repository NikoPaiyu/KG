import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCommitteeNomineeComponent } from './subject-committee-nominee.component';

describe('SubjectCommitteeNomineeComponent', () => {
  let component: SubjectCommitteeNomineeComponent;
  let fixture: ComponentFixture<SubjectCommitteeNomineeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectCommitteeNomineeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectCommitteeNomineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
