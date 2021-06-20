import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerBusinessManagementComponent } from './speaker-business-management.component';

describe('SpeakerBusinessManagementComponent', () => {
  let component: SpeakerBusinessManagementComponent;
  let fixture: ComponentFixture<SpeakerBusinessManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerBusinessManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerBusinessManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
