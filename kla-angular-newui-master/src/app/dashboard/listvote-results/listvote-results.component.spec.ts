import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListvoteResultsComponent } from './listvote-results.component';

describe('ListvoteResultsComponent', () => {
  let component: ListvoteResultsComponent;
  let fixture: ComponentFixture<ListvoteResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListvoteResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListvoteResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
