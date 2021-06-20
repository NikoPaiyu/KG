import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandwritingComponent } from './handwriting.component';

describe('HandwritingComponent', () => {
  let component: HandwritingComponent;
  let fixture: ComponentFixture<HandwritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandwritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandwritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
