import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTimeAllocationComponent } from './view-time-allocation.component';

describe('ViewTimeAllocationComponent', () => {
  let component: ViewTimeAllocationComponent;
  let fixture: ComponentFixture<ViewTimeAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTimeAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTimeAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
