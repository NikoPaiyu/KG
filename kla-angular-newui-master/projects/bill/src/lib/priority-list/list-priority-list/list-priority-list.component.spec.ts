import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPriorityListComponent } from './list-priority-list.component';

describe('ListPriorityListComponent', () => {
  let component: ListPriorityListComponent;
  let fixture: ComponentFixture<ListPriorityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPriorityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPriorityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
