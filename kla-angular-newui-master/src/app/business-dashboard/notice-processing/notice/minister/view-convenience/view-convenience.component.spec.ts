import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConvenienceComponent } from './view-convenience.component';

describe('ViewConvenienceComponent', () => {
  let component: ViewConvenienceComponent;
  let fixture: ComponentFixture<ViewConvenienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewConvenienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewConvenienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
