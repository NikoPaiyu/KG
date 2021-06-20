import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLottingNoticeComponent } from './create-lotting-notice.component';

describe('CreateLottingNoticeComponent', () => {
  let component: CreateLottingNoticeComponent;
  let fixture: ComponentFixture<CreateLottingNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLottingNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLottingNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
