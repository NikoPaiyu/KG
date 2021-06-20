import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeProcessingComponent } from './notice-processing.component';

describe('NoticeProcessingComponent', () => {
  let component: NoticeProcessingComponent;
  let fixture: ComponentFixture<NoticeProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
