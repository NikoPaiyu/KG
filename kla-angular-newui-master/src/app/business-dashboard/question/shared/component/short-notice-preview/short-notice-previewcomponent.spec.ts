import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortNoticePreviewComponent } from './short-notice-preview.component';

describe('ShortNoticePreviewComponent', () => {
  let component: ShortNoticePreviewComponent;
  let fixture: ComponentFixture<ShortNoticePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortNoticePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortNoticePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
