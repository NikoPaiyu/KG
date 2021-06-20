import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmbrResolutionComponent } from './pmbr-resolution.component';

describe('PmbrResolutionComponent', () => {
  let component: PmbrResolutionComponent;
  let fixture: ComponentFixture<PmbrResolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmbrResolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmbrResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
