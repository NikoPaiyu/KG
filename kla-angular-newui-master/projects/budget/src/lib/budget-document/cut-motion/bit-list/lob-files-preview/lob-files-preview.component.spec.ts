import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobFilesPreviewComponent } from './lob-files-preview.component';

describe('LobFilesPreviewComponent', () => {
  let component: LobFilesPreviewComponent;
  let fixture: ComponentFixture<LobFilesPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobFilesPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobFilesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
