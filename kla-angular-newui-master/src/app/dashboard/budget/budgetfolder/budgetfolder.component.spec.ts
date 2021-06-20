import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetfolderComponent } from './budgetfolder.component';

describe('BudgetfolderComponent', () => {
  let component: BudgetfolderComponent;
  let fixture: ComponentFixture<BudgetfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
