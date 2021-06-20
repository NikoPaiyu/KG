import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReporterDiaryComponent } from './create-reporter-diary.component';

describe('CreateReporterDiaryComponent', () => {
  let component: CreateReporterDiaryComponent;
  let fixture: ComponentFixture<CreateReporterDiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReporterDiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReporterDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
