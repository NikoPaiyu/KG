import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {AodMinistergroupComponent } from './aod-ministergroup.component';

describe('AodMinistergroupComponent', () => {
  let component: AodMinistergroupComponent;
  let fixture: ComponentFixture<AodMinistergroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AodMinistergroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AodMinistergroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
