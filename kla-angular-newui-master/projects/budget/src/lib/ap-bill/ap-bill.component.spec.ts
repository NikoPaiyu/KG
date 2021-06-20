import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApBillComponent } from './ap-bill.component';

describe('ApBillComponent', () => {
  let component: ApBillComponent;
  let fixture: ComponentFixture<ApBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
