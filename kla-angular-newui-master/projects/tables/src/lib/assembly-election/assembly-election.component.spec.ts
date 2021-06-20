import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyElectionComponent } from './assembly-election.component';

describe('AssemblyElectionComponent', () => {
  let component: AssemblyElectionComponent;
  let fixture: ComponentFixture<AssemblyElectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyElectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyElectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
