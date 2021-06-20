import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDiaryBulletinPart1Component } from './table-diary-bulletin-part1.component';

describe('TableDiaryBulletinPart1Component', () => {
  let component: TableDiaryBulletinPart1Component;
  let fixture: ComponentFixture<TableDiaryBulletinPart1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDiaryBulletinPart1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDiaryBulletinPart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
