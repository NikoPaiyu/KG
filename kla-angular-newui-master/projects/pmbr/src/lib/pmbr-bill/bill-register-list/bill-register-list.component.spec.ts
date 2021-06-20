import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillRegisterListComponent } from './bill-register-list.component';

describe('BillRegisterListComponent', () => {
  let component: BillRegisterListComponent;
  let fixture: ComponentFixture<BillRegisterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillRegisterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillRegisterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
