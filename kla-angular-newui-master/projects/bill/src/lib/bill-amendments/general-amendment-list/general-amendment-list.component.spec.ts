import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAmendmentListComponent } from './general-amendment-list.component';

describe('GeneralAmendmentListComponent', () => {
  let component: GeneralAmendmentListComponent;
  let fixture: ComponentFixture<GeneralAmendmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralAmendmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralAmendmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
