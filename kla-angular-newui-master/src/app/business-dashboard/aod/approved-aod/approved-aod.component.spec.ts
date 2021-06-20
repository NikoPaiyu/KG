import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedAodComponent } from './approved-aod.component';

describe('ApprovedAodComponent', () => {
  let component: ApprovedAodComponent;
  let fixture: ComponentFixture<ApprovedAodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedAodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedAodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
