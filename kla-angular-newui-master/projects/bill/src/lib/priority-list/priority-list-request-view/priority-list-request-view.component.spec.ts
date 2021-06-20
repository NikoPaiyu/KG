import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityListRequestViewComponent } from './priority-list-request-view.component';

describe('PriorityListRequestViewComponent', () => {
  let component: PriorityListRequestViewComponent;
  let fixture: ComponentFixture<PriorityListRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityListRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityListRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
