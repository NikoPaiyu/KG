import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTableDiaryComponent } from './create-table-diary.component';

describe('CreateTableDiaryComponent', () => {
  let component: CreateTableDiaryComponent;
  let fixture: ComponentFixture<CreateTableDiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTableDiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTableDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
