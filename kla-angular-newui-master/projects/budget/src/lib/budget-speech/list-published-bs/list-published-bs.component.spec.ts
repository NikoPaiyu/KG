import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPublishedBsComponent } from './list-published-bs.component';

describe('ListPublishedBsComponent', () => {
  let component: ListPublishedBsComponent;
  let fixture: ComponentFixture<ListPublishedBsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPublishedBsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPublishedBsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
