import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesAndDirectionsComponent } from './rules-and-directions.component';

describe('RulesAndDirectionsComponent', () => {
  let component: RulesAndDirectionsComponent;
  let fixture: ComponentFixture<RulesAndDirectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesAndDirectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesAndDirectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
