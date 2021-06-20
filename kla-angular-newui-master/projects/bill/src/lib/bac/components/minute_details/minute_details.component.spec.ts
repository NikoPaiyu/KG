import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinuteDetailsComponent } from './minute_details.component';

describe('MinuteDetailsComponent', () => {
  let component: MinuteDetailsComponent;
  let fixture: ComponentFixture<MinuteDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinuteDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinuteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
