import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitisationComponent } from './digitisation.component';

describe('DigitisationComponent', () => {
  let component: DigitisationComponent;
  let fixture: ComponentFixture<DigitisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
