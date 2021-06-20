import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNoticeTypeComponent } from './select-notice-type.component';

describe('SelectNoticeTypeComponent', () => {
  let component: SelectNoticeTypeComponent;
  let fixture: ComponentFixture<SelectNoticeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectNoticeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectNoticeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
