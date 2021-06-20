import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdsVersionComponent } from './dds-version.component';

describe('DdsVersionComponent', () => {
  let component: DdsVersionComponent;
  let fixture: ComponentFixture<DdsVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdsVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdsVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
