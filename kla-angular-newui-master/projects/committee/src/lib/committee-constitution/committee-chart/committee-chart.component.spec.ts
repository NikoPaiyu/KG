import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeChartComponent } from './committee-chart.component';

describe('CommitteeChartComponent', () => {
  let component: CommitteeChartComponent;
  let fixture: ComponentFixture<CommitteeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
