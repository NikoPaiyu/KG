import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTrackingMinistergroupComponent } from './file-tracking-ministergroup.component';

describe('FileTrackingMinistergroupComponent', () => {
  let component: FileTrackingMinistergroupComponent;
  let fixture: ComponentFixture<FileTrackingMinistergroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTrackingMinistergroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTrackingMinistergroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
