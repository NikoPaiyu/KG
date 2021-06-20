import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposalDashboardComponent } from './disposal-dashboard.component';

describe('DisposalDashboardComponent', () => {
  let component: DisposalDashboardComponent;
  let fixture: ComponentFixture<DisposalDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisposalDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisposalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
