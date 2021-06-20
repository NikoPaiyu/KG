import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProceedingDiaryComponent } from './create-proceeding-diary.component';

describe('CreateProceedingDiaryComponent', () => {
  let component: CreateProceedingDiaryComponent;
  let fixture: ComponentFixture<CreateProceedingDiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProceedingDiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProceedingDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
