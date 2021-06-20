import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberReadingComponent } from './member-reading.component';

describe('MemberReadingComponent', () => {
  let component: MemberReadingComponent;
  let fixture: ComponentFixture<MemberReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberReadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
