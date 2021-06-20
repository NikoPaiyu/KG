import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPositionDetailsComponent } from './member-position-details.component';

describe('MemberPositionDetailsComponent', () => {
  let component: MemberPositionDetailsComponent;
  let fixture: ComponentFixture<MemberPositionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberPositionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPositionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
