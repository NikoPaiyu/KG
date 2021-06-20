import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdfgViewComponent } from './sdfg-view.component';

describe('SdfgViewComponent', () => {
  let component: SdfgViewComponent;
  let fixture: ComponentFixture<SdfgViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdfgViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdfgViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
