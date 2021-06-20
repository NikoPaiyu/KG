import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProcessionComponent } from './list-procession.component';

describe('ListProcessionComponent', () => {
  let component: ListProcessionComponent;
  let fixture: ComponentFixture<ListProcessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProcessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProcessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
