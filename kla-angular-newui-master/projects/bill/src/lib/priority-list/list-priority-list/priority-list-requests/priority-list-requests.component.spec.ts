import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityListRequestsComponent } from './priority-list-requests.component';

describe('PriorityListRequestsComponent', () => {
  let component: PriorityListRequestsComponent;
  let fixture: ComponentFixture<PriorityListRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityListRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityListRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
