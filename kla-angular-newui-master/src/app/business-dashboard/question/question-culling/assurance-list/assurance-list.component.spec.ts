import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuranceListComponent } from './assurance-list.component';

describe('AssuredListComponent', () => {
  let component: AssuranceListComponent;
  let fixture: ComponentFixture<AssuranceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssuranceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssuranceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
