import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionFullViewComponent } from './resolution-full-view.component';

describe('ResolutionFullViewComponent', () => {
  let component: ResolutionFullViewComponent;
  let fixture: ComponentFixture<ResolutionFullViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionFullViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
