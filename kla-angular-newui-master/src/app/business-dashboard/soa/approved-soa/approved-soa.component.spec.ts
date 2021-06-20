import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedSoaComponent } from './approved-soa.component';

describe('ApprovedSoaComponent', () => {
  let component: ApprovedSoaComponent;
  let fixture: ComponentFixture<ApprovedSoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedSoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedSoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
