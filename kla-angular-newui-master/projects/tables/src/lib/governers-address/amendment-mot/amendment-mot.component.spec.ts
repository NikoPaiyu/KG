import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentMOTComponent } from './amendment-mot.component';

describe('AmendmentMOTComponent', () => {
  let component: AmendmentMOTComponent;
  let fixture: ComponentFixture<AmendmentMOTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendmentMOTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentMOTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
