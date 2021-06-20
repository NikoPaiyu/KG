import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewBulletinPart1Component } from './file-view-bulletin-part1.component';

describe('FileViewBulletinPart1Component', () => {
  let component: FileViewBulletinPart1Component;
  let fixture: ComponentFixture<FileViewBulletinPart1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileViewBulletinPart1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileViewBulletinPart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
