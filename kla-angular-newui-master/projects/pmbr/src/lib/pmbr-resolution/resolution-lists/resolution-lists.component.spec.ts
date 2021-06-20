import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionListsComponent } from './resolution-lists.component';

describe('ResolutionListsComponent', () => {
  let component: ResolutionListsComponent;
  let fixture: ComponentFixture<ResolutionListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
