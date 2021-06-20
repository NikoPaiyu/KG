import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClausesComponent } from './add-clauses.component';

describe('AddClausesComponent', () => {
  let component: AddClausesComponent;
  let fixture: ComponentFixture<AddClausesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClausesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
