import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTrackingComponent } from './file-tracking.component';

describe('FileTrackingComponent', () => {
  let component: FileTrackingComponent;
  let fixture: ComponentFixture<FileTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
