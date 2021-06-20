import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBillContentComponent } from './create-bill-content.component';

describe('CreateBillContentComponent', () => {
  let component: CreateBillContentComponent;
  let fixture: ComponentFixture<CreateBillContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBillContentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBillContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
