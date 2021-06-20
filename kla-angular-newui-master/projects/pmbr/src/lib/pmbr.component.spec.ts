import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmbrComponent } from './pmbr.component';

describe('PmbrComponent', () => {
  let component: PmbrComponent;
  let fixture: ComponentFixture<PmbrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmbrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmbrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
