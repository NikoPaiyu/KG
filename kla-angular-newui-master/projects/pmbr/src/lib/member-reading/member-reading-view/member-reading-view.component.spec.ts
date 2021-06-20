import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberReadingViewComponent } from './member-reading-view.component';

describe('MemberReadingViewComponent', () => {
  let component: MemberReadingViewComponent;
  let fixture: ComponentFixture<MemberReadingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberReadingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberReadingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
