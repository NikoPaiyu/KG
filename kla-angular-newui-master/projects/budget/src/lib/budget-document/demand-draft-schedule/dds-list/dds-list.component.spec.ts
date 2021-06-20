import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DDSListComponent } from './dds-list.component';

describe('DDSListComponent', () => {
  let component: DDSListComponent;
  let fixture: ComponentFixture<DDSListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DDSListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DDSListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
