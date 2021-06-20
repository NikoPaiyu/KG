import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDelayStatementListComponent } from './list-delay-statement-list.component';

describe('ListDelayStatementListComponent', () => {
  let component: ListDelayStatementListComponent;
  let fixture: ComponentFixture<ListDelayStatementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDelayStatementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDelayStatementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
