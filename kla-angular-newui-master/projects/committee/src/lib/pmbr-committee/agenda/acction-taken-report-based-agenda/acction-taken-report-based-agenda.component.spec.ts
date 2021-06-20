import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctionTakenReportBasedAgendaComponent } from './acction-taken-report-based-agenda.component';

describe('AcctionTakenReportBasedAgendaComponent', () => {
  let component: AcctionTakenReportBasedAgendaComponent;
  let fixture: ComponentFixture<AcctionTakenReportBasedAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctionTakenReportBasedAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctionTakenReportBasedAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
