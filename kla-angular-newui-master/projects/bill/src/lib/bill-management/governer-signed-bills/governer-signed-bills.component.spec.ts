import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernerSignedBillsComponent } from './governer-signed-bills.component';

describe('GovernerSignedBillsComponent', () => {
  let component: GovernerSignedBillsComponent;
  let fixture: ComponentFixture<GovernerSignedBillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernerSignedBillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernerSignedBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
