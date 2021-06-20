import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeViewComponent } from './committee-view.component';

describe('CommitteeViewComponent', () => {
  let component: CommitteeViewComponent;
  let fixture: ComponentFixture<CommitteeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
