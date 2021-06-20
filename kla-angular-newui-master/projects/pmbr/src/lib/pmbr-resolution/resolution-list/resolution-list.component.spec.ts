import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionListComponent } from './resolution-list.component';

describe('ResolutionListComponent', () => {
  let component: ResolutionListComponent;
  let fixture: ComponentFixture<ResolutionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
