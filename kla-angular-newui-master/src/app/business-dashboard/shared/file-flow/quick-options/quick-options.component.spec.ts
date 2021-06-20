import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickOptionsComponent } from './quick-options.component';

describe('QuickOptionsComponent', () => {
  let component: QuickOptionsComponent;
  let fixture: ComponentFixture<QuickOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
