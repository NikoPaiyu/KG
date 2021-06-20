import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBullettinComponent } from './list-bullettin.component';

describe('ListBullettinComponent', () => {
  let component: ListBullettinComponent;
  let fixture: ComponentFixture<ListBullettinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBullettinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBullettinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
