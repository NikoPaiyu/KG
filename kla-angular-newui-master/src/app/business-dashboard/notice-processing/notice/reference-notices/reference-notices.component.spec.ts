import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceNoticesComponent } from './reference-notices.component';

describe('ReferenceNoticesComponent', () => {
  let component: ReferenceNoticesComponent;
  let fixture: ComponentFixture<ReferenceNoticesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceNoticesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceNoticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
