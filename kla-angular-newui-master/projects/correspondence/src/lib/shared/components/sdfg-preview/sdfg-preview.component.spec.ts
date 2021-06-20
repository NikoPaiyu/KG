import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdfgPreViewComponent } from './sdfg-preview.component';

describe('SdfgPreViewComponent', () => {
  let component: SdfgPreViewComponent;
  let fixture: ComponentFixture<SdfgPreViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdfgPreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdfgPreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
