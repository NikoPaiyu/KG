import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuranceMainListComponent } from './assurance-main-list.component';

describe('AssuredListComponent', () => {
  let component: AssuranceMainListComponent;
  let fixture: ComponentFixture<AssuranceMainListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssuranceMainListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssuranceMainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
