import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftCorrespondenceComponent } from './draft-correspondence.component';

describe('DraftCorrespondenceComponent', () => {
  let component: DraftCorrespondenceComponent;
  let fixture: ComponentFixture<DraftCorrespondenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftCorrespondenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftCorrespondenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
