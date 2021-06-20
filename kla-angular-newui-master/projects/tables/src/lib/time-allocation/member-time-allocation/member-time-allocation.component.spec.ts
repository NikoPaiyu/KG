import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberTimeAllocationComponent } from './member-time-allocation.component';

describe('MemberTimeAllocationComponent', () => {
  let component: MemberTimeAllocationComponent;
  let fixture: ComponentFixture<MemberTimeAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberTimeAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTimeAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
