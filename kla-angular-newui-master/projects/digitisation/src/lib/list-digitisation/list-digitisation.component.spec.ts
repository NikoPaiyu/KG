import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDigitisationComponent } from './list-digitisation.component';

describe('ListDigitisationComponent', () => {
  let component: ListDigitisationComponent;
  let fixture: ComponentFixture<ListDigitisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDigitisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDigitisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
