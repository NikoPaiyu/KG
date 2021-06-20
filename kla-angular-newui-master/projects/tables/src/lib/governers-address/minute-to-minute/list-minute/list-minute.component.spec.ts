import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMinuteComponent } from './list-minute.component';

describe('ListMinuteComponent', () => {
  let component: ListMinuteComponent;
  let fixture: ComponentFixture<ListMinuteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMinuteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMinuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
