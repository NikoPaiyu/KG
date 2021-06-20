import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftListPreviewComponent } from './draft-list-preview.component';

describe('DraftListPreviewComponent', () => {
  let component: DraftListPreviewComponent;
  let fixture: ComponentFixture<DraftListPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftListPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftListPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
