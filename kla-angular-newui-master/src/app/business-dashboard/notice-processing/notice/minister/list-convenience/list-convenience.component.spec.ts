import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConvenienceComponent } from './list-convenience.component';

describe('ListConvenienceComponent', () => {
  let component: ListConvenienceComponent;
  let fixture: ComponentFixture<ListConvenienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListConvenienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConvenienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
