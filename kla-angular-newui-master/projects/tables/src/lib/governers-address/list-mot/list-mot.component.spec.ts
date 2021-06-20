import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMOTComponent } from './list-mot.component';

describe('ListMOTComponent', () => {
  let component: ListMOTComponent;
  let fixture: ComponentFixture<ListMOTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMOTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMOTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
