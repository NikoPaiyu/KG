import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceFileViewComponent } from './attendence-file-view.component';

describe('AttendenceFileViewComponent', () => {
  let component: AttendenceFileViewComponent;
  let fixture: ComponentFixture<AttendenceFileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendenceFileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendenceFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
