import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporterDairyTableComponent } from './reporter-dairy-table.component';

describe('ReporterDairyTableComponent', () => {
  let component: ReporterDairyTableComponent;
  let fixture: ComponentFixture<ReporterDairyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporterDairyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporterDairyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
