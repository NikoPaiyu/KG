import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerElectionViewComponent } from './speaker-election-view.component';

describe('SpeakerElectionViewComponent', () => {
  let component: SpeakerElectionViewComponent;
  let fixture: ComponentFixture<SpeakerElectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerElectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerElectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
