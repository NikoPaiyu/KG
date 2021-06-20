import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CplViewComponent } from './cpl-view.component';

describe('CplViewComponent', () => {
  let component: CplViewComponent;
  let fixture: ComponentFixture<CplViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CplViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CplViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
