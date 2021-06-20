import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillRegisterViewComponent } from './bill-register-view.component';

describe('BillRegisterViewComponent', () => {
  let component: BillRegisterViewComponent;
  let fixture: ComponentFixture<BillRegisterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillRegisterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillRegisterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
