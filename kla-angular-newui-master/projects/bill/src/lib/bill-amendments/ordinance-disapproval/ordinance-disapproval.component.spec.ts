import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdinanceDisapprovalComponent } from './ordinance-disapproval.component';

describe('OrdinanceDisapprovalComponent', () => {
  let component: OrdinanceDisapprovalComponent;
  let fixture: ComponentFixture<OrdinanceDisapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdinanceDisapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdinanceDisapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
