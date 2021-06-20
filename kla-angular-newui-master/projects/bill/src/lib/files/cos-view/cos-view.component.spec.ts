import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CosViewComponent } from './cos-view.component';

describe('CosViewComponent', () => {
  let component: CosViewComponent;
  let fixture: ComponentFixture<CosViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
