import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentNumberComponent } from './current-number.component';

describe('CurrentNumberComponent', () => {
  let component: CurrentNumberComponent;
  let fixture: ComponentFixture<CurrentNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
