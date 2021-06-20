import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentNumberListComponent } from './current-number-list.component';

describe('CurrentNumberListComponent', () => {
  let component: CurrentNumberListComponent;
  let fixture: ComponentFixture<CurrentNumberListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentNumberListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentNumberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
