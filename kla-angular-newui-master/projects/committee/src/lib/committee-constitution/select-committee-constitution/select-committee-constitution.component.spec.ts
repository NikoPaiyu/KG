import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCommitteeConstitutionComponent } from './select-committee-constitution.component';

describe('SelectCommitteeConstitutionComponent', () => {
  let component: SelectCommitteeConstitutionComponent;
  let fixture: ComponentFixture<SelectCommitteeConstitutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCommitteeConstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCommitteeConstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
