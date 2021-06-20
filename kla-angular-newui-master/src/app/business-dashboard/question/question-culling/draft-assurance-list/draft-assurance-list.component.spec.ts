import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftAssuranceListComponent } from './draft-assurance-list.component';

describe('AssuredListComponent', () => {
  let component: DraftAssuranceListComponent;
  let fixture: ComponentFixture<DraftAssuranceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftAssuranceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftAssuranceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
