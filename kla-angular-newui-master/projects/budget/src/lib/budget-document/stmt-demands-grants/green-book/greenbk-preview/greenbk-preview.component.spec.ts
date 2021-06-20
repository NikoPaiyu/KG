import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenbkPreviewComponent } from './greenbk-preview.component';

describe('GreenbkPreviewComponent', () => {
  let component: GreenbkPreviewComponent;
  let fixture: ComponentFixture<GreenbkPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreenbkPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreenbkPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
