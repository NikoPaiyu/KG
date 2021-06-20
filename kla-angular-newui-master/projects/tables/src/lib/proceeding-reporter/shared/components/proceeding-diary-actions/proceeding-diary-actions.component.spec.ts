import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedingDiaryActionsComponent } from './proceeding-diary-actions.component';

describe('ProceedingDiaryActionsComponent', () => {
  let component: ProceedingDiaryActionsComponent;
  let fixture: ComponentFixture<ProceedingDiaryActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProceedingDiaryActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceedingDiaryActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
