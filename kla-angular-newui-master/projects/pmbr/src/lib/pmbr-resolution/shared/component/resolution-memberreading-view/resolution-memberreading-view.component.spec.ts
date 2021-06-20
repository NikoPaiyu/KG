import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionMemberreadingViewComponent } from './resolution-memberreading-view.component';

describe('ResolutionMemberreadingViewComponent', () => {
  let component: ResolutionMemberreadingViewComponent;
  let fixture: ComponentFixture<ResolutionMemberreadingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionMemberreadingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionMemberreadingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
