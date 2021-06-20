import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionViewComponent } from './resolution-view.component';

describe('ResolutionViewComponent', () => {
  let component: ResolutionViewComponent;
  let fixture: ComponentFixture<ResolutionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
