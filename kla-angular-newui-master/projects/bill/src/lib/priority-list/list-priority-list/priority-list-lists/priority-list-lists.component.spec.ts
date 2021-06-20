import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityListListsComponent } from './priority-list-lists.component';

describe('PriorityListListsComponent', () => {
  let component: PriorityListListsComponent;
  let fixture: ComponentFixture<PriorityListListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorityListListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityListListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
