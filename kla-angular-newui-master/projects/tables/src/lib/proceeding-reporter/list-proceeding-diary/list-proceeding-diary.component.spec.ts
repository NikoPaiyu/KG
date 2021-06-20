import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProceedingDiaryComponent } from './list-proceeding-diary.component';

describe('ListProceedingDiaryComponent', () => {
  let component: ListProceedingDiaryComponent;
  let fixture: ComponentFixture<ListProceedingDiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProceedingDiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProceedingDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
