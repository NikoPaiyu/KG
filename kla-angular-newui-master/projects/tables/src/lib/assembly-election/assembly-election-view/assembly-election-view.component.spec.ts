import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyElectionViewComponent } from './assembly-election-view.component';

describe('AssemblyElectionViewComponent', () => {
  let component: AssemblyElectionViewComponent;
  let fixture: ComponentFixture<AssemblyElectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyElectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyElectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
