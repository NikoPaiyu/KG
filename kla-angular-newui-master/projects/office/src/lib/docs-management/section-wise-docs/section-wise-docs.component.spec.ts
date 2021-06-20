import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionWiseDocsComponent } from './section-wise-docs.component';

describe('SectionWiseDocsComponent', () => {
  let component: SectionWiseDocsComponent;
  let fixture: ComponentFixture<SectionWiseDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionWiseDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionWiseDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
