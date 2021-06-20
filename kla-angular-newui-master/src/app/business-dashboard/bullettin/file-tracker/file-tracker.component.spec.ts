import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTrackerComponent } from './file-tracker.component';

describe('FileTrackerComponent', () => {
  let component: FileTrackerComponent;
  let fixture: ComponentFixture<FileTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
