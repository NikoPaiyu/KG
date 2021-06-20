import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCommitteeFileviewComponent } from './subject-committee-fileview.component';

describe('SubjectCommitteeFileviewComponent', () => {
  let component: SubjectCommitteeFileviewComponent;
  let fixture: ComponentFixture<SubjectCommitteeFileviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectCommitteeFileviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectCommitteeFileviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
