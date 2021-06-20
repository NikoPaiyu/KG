import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialDaysComponent } from './initial-days.component';

describe('InitialDaysComponent', () => {
  let component: InitialDaysComponent;
  let fixture: ComponentFixture<InitialDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
