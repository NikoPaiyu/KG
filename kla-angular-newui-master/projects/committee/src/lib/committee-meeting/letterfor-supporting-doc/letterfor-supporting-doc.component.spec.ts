import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterforSupportingDocComponent } from './letterfor-supporting-doc.component';

describe('LetterforSupportingDocComponent', () => {
  let component: LetterforSupportingDocComponent;
  let fixture: ComponentFixture<LetterforSupportingDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterforSupportingDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterforSupportingDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
