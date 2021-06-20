import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtemSpeakerListComponent } from './protem-speaker-list.component';

describe('ProtemSpeakerListComponent', () => {
  let component: ProtemSpeakerListComponent;
  let fixture: ComponentFixture<ProtemSpeakerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtemSpeakerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtemSpeakerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
