import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdsPreviewComponent } from './dds-preview.component';

describe('DdsPreviewComponent', () => {
  let component: DdsPreviewComponent;
  let fixture: ComponentFixture<DdsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
