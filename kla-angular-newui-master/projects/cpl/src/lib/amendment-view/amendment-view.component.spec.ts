import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentViewComponent } from './amendment-view.component';

describe('AmendmentViewComponent', () => {
  let component: AmendmentViewComponent;
  let fixture: ComponentFixture<AmendmentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmendmentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmendmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
