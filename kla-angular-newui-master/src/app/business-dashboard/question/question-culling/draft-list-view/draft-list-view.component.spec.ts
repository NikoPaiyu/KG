import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftListViewComponent } from './draft-list-view.component';

describe('DraftListViewComponent', () => {
  let component: DraftListViewComponent;
  let fixture: ComponentFixture<DraftListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
