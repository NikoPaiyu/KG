import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTableDiaryBulletinPart1Component } from './list-table-diary-bulletin-part1.component';

describe('ListTableDiaryBulletinPart1Component', () => {
  let component: ListTableDiaryBulletinPart1Component;
  let fixture: ComponentFixture<ListTableDiaryBulletinPart1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTableDiaryBulletinPart1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTableDiaryBulletinPart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
