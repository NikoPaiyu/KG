import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommitteeResponseComponent } from './add-committee-response.component';

describe('AddCommitteeResponseComponent', () => {
  let component: AddCommitteeResponseComponent;
  let fixture: ComponentFixture<AddCommitteeResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommitteeResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommitteeResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
