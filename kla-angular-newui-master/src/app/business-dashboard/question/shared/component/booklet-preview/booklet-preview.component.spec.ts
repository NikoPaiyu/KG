import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookletPreviewComponent } from './booklet-preview.component';

describe('BookletPreviewComponent', () => {
  let component: BookletPreviewComponent;
  let fixture: ComponentFixture<BookletPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookletPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookletPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
