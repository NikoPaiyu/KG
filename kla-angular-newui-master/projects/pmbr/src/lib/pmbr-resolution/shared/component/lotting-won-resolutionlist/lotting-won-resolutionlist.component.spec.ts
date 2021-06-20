import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottingWonResolutionlistComponent } from './lotting-won-resolutionlist.component';

describe('LottingWonResolutionlistComponent', () => {
  let component: LottingWonResolutionlistComponent;
  let fixture: ComponentFixture<LottingWonResolutionlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottingWonResolutionlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottingWonResolutionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
