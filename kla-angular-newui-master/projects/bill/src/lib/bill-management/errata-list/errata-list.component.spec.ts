import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrataListComponent } from './errata-list.component';

describe('ErrataListComponent', () => {
  let component: ErrataListComponent;
  let fixture: ComponentFixture<ErrataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
