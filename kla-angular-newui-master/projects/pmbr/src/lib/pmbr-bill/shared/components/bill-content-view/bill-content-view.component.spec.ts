import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillContentViewComponent } from './bill-content-view.component';

describe('BillContentViewComponent', () => {
  let component: BillContentViewComponent;
  let fixture: ComponentFixture<BillContentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillContentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
