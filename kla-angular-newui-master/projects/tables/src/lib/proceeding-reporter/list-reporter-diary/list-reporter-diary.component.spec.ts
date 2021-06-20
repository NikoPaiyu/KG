import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReporterDiaryComponent } from './list-reporter-diary.component';

describe('ListReporterDiaryComponent', () => {
  let component: ListReporterDiaryComponent;
  let fixture: ComponentFixture<ListReporterDiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReporterDiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReporterDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
