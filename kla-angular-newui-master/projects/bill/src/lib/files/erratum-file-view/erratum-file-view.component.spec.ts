import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErratumFileViewComponent } from './erratum-file-view.component';

describe('ErratumFileViewComponent', () => {
  let component: ErratumFileViewComponent;
  let fixture: ComponentFixture<ErratumFileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErratumFileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErratumFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
