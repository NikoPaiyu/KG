import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionContentViewComponent } from './resolution-content-view.component';

describe('ResolutionContentViewComponent', () => {
  let component: ResolutionContentViewComponent;
  let fixture: ComponentFixture<ResolutionContentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionContentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
