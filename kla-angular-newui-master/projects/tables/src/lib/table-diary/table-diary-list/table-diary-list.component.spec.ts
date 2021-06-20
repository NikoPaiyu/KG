import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDiaryListComponent } from './table-diary-list.component';

describe('TableDiaryListComponent', () => {
  let component: TableDiaryListComponent;
  let fixture: ComponentFixture<TableDiaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDiaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDiaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
