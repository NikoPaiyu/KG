import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesAndProcedureComponent } from './rules-and-procedure.component';

describe('RulesAndProcedureComponent', () => {
  let component: RulesAndProcedureComponent;
  let fixture: ComponentFixture<RulesAndProcedureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesAndProcedureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesAndProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
