import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyRelatedAgendaComponent } from './assembly-related-agenda.component';

describe('AssemblyRelatedAgendaComponent', () => {
  let component: AssemblyRelatedAgendaComponent;
  let fixture: ComponentFixture<AssemblyRelatedAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyRelatedAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyRelatedAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
