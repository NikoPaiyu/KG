import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSeatConfrigurationComponent } from './section-seat-confriguration.component';

describe('SectionSeatConfrigurationComponent', () => {
  let component: SectionSeatConfrigurationComponent;
  let fixture: ComponentFixture<SectionSeatConfrigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionSeatConfrigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionSeatConfrigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
