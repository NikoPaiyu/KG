import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityListViewComponent } from './priority-list-view.component';

describe('PriorityListViewComponent', () => {
  let component: PriorityListViewComponent;
  let fixture: ComponentFixture<PriorityListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
