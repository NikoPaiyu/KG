import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottingNoticeListComponent } from './lotting-notice-list.component';

describe('LottingNoticeListComponent', () => {
  let component: LottingNoticeListComponent;
  let fixture: ComponentFixture<LottingNoticeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottingNoticeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottingNoticeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
