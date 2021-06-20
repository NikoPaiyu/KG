import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAgendaComponent } from './list-agenda.component';

describe('ListAgendaComponent', () => {
  let component: ListAgendaComponent;
  let fixture: ComponentFixture<ListAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
