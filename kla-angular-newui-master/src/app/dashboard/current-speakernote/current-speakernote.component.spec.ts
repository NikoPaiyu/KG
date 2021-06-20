import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSpeakernoteComponent } from './current-speakernote.component';

describe('CurrentSpeakernoteComponent', () => {
  let component: CurrentSpeakernoteComponent;
  let fixture: ComponentFixture<CurrentSpeakernoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentSpeakernoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSpeakernoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
