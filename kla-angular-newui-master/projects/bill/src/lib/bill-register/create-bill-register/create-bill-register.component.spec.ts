import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBillRegisterComponent } from './create-bill-register.component';

describe('CreateBillRegisterComponent', () => {
  let component: CreateBillRegisterComponent;
  let fixture: ComponentFixture<CreateBillRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBillRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBillRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
