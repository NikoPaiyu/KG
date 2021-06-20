import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFullViewComponent } from './bill-full-view.component';

describe('BillFullViewComponent', () => {
  let component: BillFullViewComponent;
  let fixture: ComponentFixture<BillFullViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillFullViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
