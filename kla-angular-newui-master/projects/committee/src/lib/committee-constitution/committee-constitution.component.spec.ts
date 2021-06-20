import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeConstitutionComponent } from './committee-constitution.component';

describe('CommitteeConstitutionComponent', () => {
  let component: CommitteeConstitutionComponent;
  let fixture: ComponentFixture<CommitteeConstitutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeConstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeConstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
