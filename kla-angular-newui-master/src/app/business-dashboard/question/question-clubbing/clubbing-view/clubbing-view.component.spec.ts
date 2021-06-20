import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubbingViewComponent } from './clubbing-view.component';

describe('ClubbingViewComponent', () => {
  let component: ClubbingViewComponent;
  let fixture: ComponentFixture<ClubbingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubbingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubbingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
