import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberswitchComponent } from './memberswitch.component';

describe('MemberswitchComponent', () => {
  let component: MemberswitchComponent;
  let fixture: ComponentFixture<MemberswitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberswitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberswitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
