import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssuranceComponent } from './create-assurance.component';

describe('CreateAssuranceComponent', () => {
  let component: CreateAssuranceComponent;
  let fixture: ComponentFixture<CreateAssuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
