import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareBitListComponent } from './prepare-bit-list.component';

describe('PrepareBitListComponent', () => {
  let component: PrepareBitListComponent;
  let fixture: ComponentFixture<PrepareBitListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareBitListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareBitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
