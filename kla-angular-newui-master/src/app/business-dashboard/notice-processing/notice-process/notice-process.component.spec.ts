import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeProcessComponent } from './notice-process.component';

describe('NoticeProcessComponent', () => {
  let component: NoticeProcessComponent;
  let fixture: ComponentFixture<NoticeProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
