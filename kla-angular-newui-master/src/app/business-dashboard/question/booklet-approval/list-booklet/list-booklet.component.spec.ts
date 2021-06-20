import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookletComponent } from './list-booklet.component';

describe('ListBookletComponent', () => {
  let component: ListBookletComponent;
  let fixture: ComponentFixture<ListBookletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBookletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBookletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
