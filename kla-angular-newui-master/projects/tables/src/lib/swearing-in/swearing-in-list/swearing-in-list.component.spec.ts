import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwearingInListComponent } from './swearing-in-list.component';

describe('SwearingInListComponent', () => {
  let component: SwearingInListComponent;
  let fixture: ComponentFixture<SwearingInListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwearingInListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwearingInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
