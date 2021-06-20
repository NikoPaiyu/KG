import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveBusinessManagementComponent } from './live-business-management.component';

describe('LiveBusinessManagementComponent', () => {
  let component: LiveBusinessManagementComponent;
  let fixture: ComponentFixture<LiveBusinessManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveBusinessManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveBusinessManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
