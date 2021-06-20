import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDigitisationComponent } from './create-digitisation.component';

describe('CreateDigitisationComponent', () => {
  let component: CreateDigitisationComponent;
  let fixture: ComponentFixture<CreateDigitisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDigitisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDigitisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
