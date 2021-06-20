import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBusinessComponent } from './current-business.component';

describe('CurrentBusinessComponent', () => {
  let component: CurrentBusinessComponent;
  let fixture: ComponentFixture<CurrentBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
