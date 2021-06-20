import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtemSpeakerViewComponent } from './protem-speaker-view.component';

describe('ProtemSpeakerViewComponent', () => {
  let component: ProtemSpeakerViewComponent;
  let fixture: ComponentFixture<ProtemSpeakerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtemSpeakerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtemSpeakerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
