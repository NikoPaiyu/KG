import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTimeAllocationComponent } from './generate-time-allocation.component';

describe('GenerateTimeAllocationComponent', () => {
  let component: GenerateTimeAllocationComponent;
  let fixture: ComponentFixture<GenerateTimeAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateTimeAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateTimeAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
