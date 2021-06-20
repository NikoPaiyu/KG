import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCommitteeResponseComponent } from './view-committee-response.component';

describe('ViewCommitteeResponseComponent', () => {
  let component: ViewCommitteeResponseComponent;
  let fixture: ComponentFixture<ViewCommitteeResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCommitteeResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCommitteeResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
