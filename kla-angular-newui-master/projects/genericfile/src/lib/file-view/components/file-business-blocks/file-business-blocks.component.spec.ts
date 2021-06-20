import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileBusinessBlocksComponent } from './file-business-blocks.component';

describe('FileBusinessBlocksComponent', () => {
  let component: FileBusinessBlocksComponent;
  let fixture: ComponentFixture<FileBusinessBlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileBusinessBlocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileBusinessBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
