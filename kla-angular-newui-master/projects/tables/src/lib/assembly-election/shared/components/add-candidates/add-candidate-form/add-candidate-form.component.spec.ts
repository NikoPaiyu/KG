import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCandidateFormComponent } from './add-candidate-form.component';

describe('AddCandidateFormComponent', () => {
  let component: AddCandidateFormComponent;
  let fixture: ComponentFixture<AddCandidateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCandidateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCandidateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
