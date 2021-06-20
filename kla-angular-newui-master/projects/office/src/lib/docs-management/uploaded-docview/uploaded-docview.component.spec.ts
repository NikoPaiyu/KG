import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedDocviewComponent } from './uploaded-docview.component';

describe('UploadedDocviewComponent', () => {
  let component: UploadedDocviewComponent;
  let fixture: ComponentFixture<UploadedDocviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadedDocviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedDocviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
