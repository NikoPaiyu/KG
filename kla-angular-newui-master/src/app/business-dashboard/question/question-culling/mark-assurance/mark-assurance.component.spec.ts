import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAssuranceComponent } from './mark-assurance.component';

describe('MarkAssuranceComponent', () => {
  let component: MarkAssuranceComponent;
  let fixture: ComponentFixture<MarkAssuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAssuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAssuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
