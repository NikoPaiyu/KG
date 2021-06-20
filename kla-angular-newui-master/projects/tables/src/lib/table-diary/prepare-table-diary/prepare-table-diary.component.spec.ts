import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareTableDiaryComponent } from './prepare-table-diary.component';

describe('PrepareTableDiaryComponent', () => {
  let component: PrepareTableDiaryComponent;
  let fixture: ComponentFixture<PrepareTableDiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareTableDiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareTableDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
