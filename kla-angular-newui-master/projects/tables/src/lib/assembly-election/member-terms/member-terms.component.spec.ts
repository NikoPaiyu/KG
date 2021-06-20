import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberTermsComponent } from './member-terms.component';

describe('MemberTermsComponent', () => {
  let component: MemberTermsComponent;
  let fixture: ComponentFixture<MemberTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
