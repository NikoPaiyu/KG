import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AodViewComponent } from './aod-view.component';

describe('AodViewComponent', () => {
  let component: AodViewComponent;
  let fixture: ComponentFixture<AodViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AodViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AodViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
