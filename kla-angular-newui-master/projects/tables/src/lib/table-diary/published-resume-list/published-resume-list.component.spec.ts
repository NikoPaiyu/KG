import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedResumeListComponent } from './published-resume-list.component';

describe('PublishedResumeListComponent', () => {
  let component: PublishedResumeListComponent;
  let fixture: ComponentFixture<PublishedResumeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedResumeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedResumeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
