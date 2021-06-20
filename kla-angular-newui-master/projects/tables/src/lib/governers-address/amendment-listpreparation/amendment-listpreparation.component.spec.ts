import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentListpreparationComponent } from './amendment-listpreparation.component';

describe('AmendmentListpreparationComponent', () => {
  let component: AmendmentListpreparationComponent;
  let fixture: ComponentFixture<AmendmentListpreparationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendmentListpreparationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentListpreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
