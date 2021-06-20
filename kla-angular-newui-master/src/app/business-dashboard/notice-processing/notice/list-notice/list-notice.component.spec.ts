import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNoticeComponent } from './list-notice.component';

describe('ListNoticeComponent', () => {
  let component: ListNoticeComponent;
  let fixture: ComponentFixture<ListNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
