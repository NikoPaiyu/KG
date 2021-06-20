import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeEditComponent } from './committee-edit.component';

describe('CommitteeEditComponent', () => {
  let component: CommitteeEditComponent;
  let fixture: ComponentFixture<CommitteeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
