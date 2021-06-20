import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionCreateNoticeComponent } from './resolution-create-notice.component';

describe('ResolutionCreateNoticeComponent', () => {
  let component: ResolutionCreateNoticeComponent;
  let fixture: ComponentFixture<ResolutionCreateNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionCreateNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionCreateNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
