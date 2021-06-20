import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedingReporterComponent } from './proceeding-reporter.component';

describe('ProceedingReporterComponent', () => {
  let component: ProceedingReporterComponent;
  let fixture: ComponentFixture<ProceedingReporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProceedingReporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceedingReporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
