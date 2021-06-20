import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuranceViewComponent } from './assurance-view.component';

describe('AssuranceViewComponent', () => {
  let component: AssuranceViewComponent;
  let fixture: ComponentFixture<AssuranceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssuranceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssuranceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
