import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBillContentSelectComponent } from './create-bill-content-select.component';

describe('CreateBillContentSelectComponent', () => {
  let component: CreateBillContentSelectComponent;
  let fixture: ComponentFixture<CreateBillContentSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBillContentSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBillContentSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
