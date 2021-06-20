import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BullettinCurrentNumberComponent } from './bullettin-current-number.component';

describe('BullettinCurrentNumberComponent', () => {
  let component: BullettinCurrentNumberComponent;
  let fixture: ComponentFixture<BullettinCurrentNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BullettinCurrentNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BullettinCurrentNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
