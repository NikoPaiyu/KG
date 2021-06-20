import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerElectionListComponent } from './speaker-election-list.component';

describe('SpeakerElectionListComponent', () => {
  let component: SpeakerElectionListComponent;
  let fixture: ComponentFixture<SpeakerElectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerElectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerElectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
