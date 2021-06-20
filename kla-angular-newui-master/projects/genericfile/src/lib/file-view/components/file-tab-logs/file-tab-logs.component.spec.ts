import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTabLogsComponent } from './file-tab-logs.component';

describe('FileTabLogsComponent', () => {
  let component: FileTabLogsComponent;
  let fixture: ComponentFixture<FileTabLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTabLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTabLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
