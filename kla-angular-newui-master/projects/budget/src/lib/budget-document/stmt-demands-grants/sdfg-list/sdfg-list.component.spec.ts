import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdfgListComponent } from './sdfg-list.component';

describe('SdfgListComponent', () => {
  let component: SdfgListComponent;
  let fixture: ComponentFixture<SdfgListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdfgListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdfgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
