import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocAmendmentsComponent } from './doc-amendments.component';

describe('DocAmendmentsComponent', () => {
  let component: DocAmendmentsComponent;
  let fixture: ComponentFixture<DocAmendmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocAmendmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocAmendmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
