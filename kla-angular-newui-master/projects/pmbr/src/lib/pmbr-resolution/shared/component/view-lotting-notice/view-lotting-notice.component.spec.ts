import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLottingNoticeComponent } from './view-lotting-notice.component';

describe('ViewLottingNoticeComponent', () => {
  let component: ViewLottingNoticeComponent;
  let fixture: ComponentFixture<ViewLottingNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLottingNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLottingNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
