import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondenceDetailViewComponent } from './correspondence-detail-view.component';

describe('CorrespondenceDetailViewComponent', () => {
  let component: CorrespondenceDetailViewComponent;
  let fixture: ComponentFixture<CorrespondenceDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrespondenceDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondenceDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
