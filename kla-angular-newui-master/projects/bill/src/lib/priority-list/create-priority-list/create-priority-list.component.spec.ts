import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePriorityListComponent } from './create-priority-list.component';

describe('CreatePriorityListComponent', () => {
  let component: CreatePriorityListComponent;
  let fixture: ComponentFixture<CreatePriorityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePriorityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePriorityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
