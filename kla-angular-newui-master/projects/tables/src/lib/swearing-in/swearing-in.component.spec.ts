import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwearingInComponent } from './swearing-in.component';

describe('SwearingInComponent', () => {
  let component: SwearingInComponent;
  let fixture: ComponentFixture<SwearingInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwearingInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwearingInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
