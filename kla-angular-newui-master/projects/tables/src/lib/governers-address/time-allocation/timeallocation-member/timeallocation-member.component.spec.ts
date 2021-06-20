import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeallocationMemberComponent } from './timeallocation-member.component';

describe('TimeallocationMemberComponent', () => {
  let component: TimeallocationMemberComponent;
  let fixture: ComponentFixture<TimeallocationMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeallocationMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeallocationMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
