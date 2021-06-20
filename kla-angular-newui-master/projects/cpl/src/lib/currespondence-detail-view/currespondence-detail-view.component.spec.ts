import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrespondenceDetailViewComponent } from './currespondence-detail-view.component';

describe('CurrespondenceDetailViewComponent', () => {
  let component: CurrespondenceDetailViewComponent;
  let fixture: ComponentFixture<CurrespondenceDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrespondenceDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrespondenceDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
