import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmbrBillComponent } from './pmbr-bill.component';

describe('PmbrBillComponent', () => {
  let component: PmbrBillComponent;
  let fixture: ComponentFixture<PmbrBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmbrBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmbrBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
