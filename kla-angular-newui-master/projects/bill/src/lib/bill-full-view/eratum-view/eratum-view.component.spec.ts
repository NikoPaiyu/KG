import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EratumViewComponent } from './eratum-view.component';

describe('EratumViewComponent', () => {
  let component: EratumViewComponent;
  let fixture: ComponentFixture<EratumViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EratumViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EratumViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
