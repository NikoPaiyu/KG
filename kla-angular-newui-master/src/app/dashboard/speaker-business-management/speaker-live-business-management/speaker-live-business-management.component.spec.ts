import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerLiveBusinessManagementComponent } from './speaker-live-business-management.component';

describe('SpeakerLiveBusinessManagementComponent', () => {
  let component: SpeakerLiveBusinessManagementComponent;
  let fixture: ComponentFixture<SpeakerLiveBusinessManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerLiveBusinessManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerLiveBusinessManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
