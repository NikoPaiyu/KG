import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyElectionListComponent } from './assembly-election-list.component';

describe('AssemblyElectionListComponent', () => {
  let component: AssemblyElectionListComponent;
  let fixture: ComponentFixture<AssemblyElectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyElectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyElectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
