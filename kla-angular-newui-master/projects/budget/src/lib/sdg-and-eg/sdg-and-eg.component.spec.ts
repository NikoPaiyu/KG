import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdgAndEgComponent } from './sdg-and-eg.component';

describe('SdgAndEgComponent', () => {
  let component: SdgAndEgComponent;
  let fixture: ComponentFixture<SdgAndEgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdgAndEgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdgAndEgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
