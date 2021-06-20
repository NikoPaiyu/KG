import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CplComponent } from './cpl.component';

describe('CplComponent', () => {
  let component: CplComponent;
  let fixture: ComponentFixture<CplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
