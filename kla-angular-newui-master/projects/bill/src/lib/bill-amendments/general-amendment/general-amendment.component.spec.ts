import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAmendmentComponent } from './general-amendment.component';

describe('GeneralAmendmentComponent', () => {
  let component: GeneralAmendmentComponent;
  let fixture: ComponentFixture<GeneralAmendmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralAmendmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralAmendmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
