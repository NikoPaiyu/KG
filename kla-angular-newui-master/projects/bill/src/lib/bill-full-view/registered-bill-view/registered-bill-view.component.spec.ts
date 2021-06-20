import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredBillViewComponent } from './registered-bill-view.component';

describe('RegisteredBillViewComponent', () => {
  let component: RegisteredBillViewComponent;
  let fixture: ComponentFixture<RegisteredBillViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredBillViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredBillViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
