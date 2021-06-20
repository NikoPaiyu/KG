import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeallocationTsComponent } from './timeallocation-ts.component';

describe('TimeallocationTsComponent', () => {
  let component: TimeallocationTsComponent;
  let fixture: ComponentFixture<TimeallocationTsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeallocationTsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeallocationTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
