import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandRaiseComponent } from './hand-raise.component';

describe('HandRaiseComponent', () => {
  let component: HandRaiseComponent;
  let fixture: ComponentFixture<HandRaiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandRaiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandRaiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
