import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBillNoticeComponent } from './create-notice.component';

describe('CreateNoticeComponent', () => {
  let component: CreateBillNoticeComponent;
  let fixture: ComponentFixture<CreateBillNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBillNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBillNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
