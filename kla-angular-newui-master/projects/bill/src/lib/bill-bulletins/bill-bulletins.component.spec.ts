import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillBulletinsComponent } from './bill-bulletins.component';

describe('BillBulletinsComponent', () => {
  let component: BillBulletinsComponent;
  let fixture: ComponentFixture<BillBulletinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillBulletinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillBulletinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
