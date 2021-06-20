import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialInviteeComponent } from './special-invitee.component';

describe('SpecialInviteeComponent', () => {
  let component: SpecialInviteeComponent;
  let fixture: ComponentFixture<SpecialInviteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialInviteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialInviteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
