import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BullettinDetailsComponent } from './bullettin-details.component';

describe('BullettinDetailsComponent', () => {
  let component: BullettinDetailsComponent;
  let fixture: ComponentFixture<BullettinDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BullettinDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BullettinDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
