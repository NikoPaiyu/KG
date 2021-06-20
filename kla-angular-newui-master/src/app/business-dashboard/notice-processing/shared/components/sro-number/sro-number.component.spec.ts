import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SroNumberComponent } from './sro-number.component';

describe('SroNumberComponent', () => {
  let component: SroNumberComponent;
  let fixture: ComponentFixture<SroNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SroNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SroNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
