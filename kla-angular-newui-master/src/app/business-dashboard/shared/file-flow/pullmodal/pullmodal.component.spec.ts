import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PullmodalComponent } from './pullmodal.component';

describe('PullmodalComponent', () => {
  let component: PullmodalComponent;
  let fixture: ComponentFixture<PullmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PullmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PullmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
