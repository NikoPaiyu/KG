import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaidListComponent } from './laid-list.component';

describe('LaidListComponent', () => {
  let component: LaidListComponent;
  let fixture: ComponentFixture<LaidListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaidListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
