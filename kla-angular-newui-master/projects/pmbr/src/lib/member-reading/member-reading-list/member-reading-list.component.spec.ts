import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberReadingListComponent } from './member-reading-list.component';

describe('MemberReadingListComponent', () => {
  let component: MemberReadingListComponent;
  let fixture: ComponentFixture<MemberReadingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberReadingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberReadingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
