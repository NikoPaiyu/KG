import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCommitteeConstitutionComponent } from './create-committee-constitution.component';

describe('CreateCommitteeConstitutionComponent', () => {
  let component: CreateCommitteeConstitutionComponent;
  let fixture: ComponentFixture<CreateCommitteeConstitutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCommitteeConstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommitteeConstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
