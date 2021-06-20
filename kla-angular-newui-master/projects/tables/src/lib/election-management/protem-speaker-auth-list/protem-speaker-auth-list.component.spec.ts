import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtemSpeakerAuthListComponent } from './protem-speaker-auth-list.component';

describe('ProtemSpeakerAuthListComponent', () => {
  let component: ProtemSpeakerAuthListComponent;
  let fixture: ComponentFixture<ProtemSpeakerAuthListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtemSpeakerAuthListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtemSpeakerAuthListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
