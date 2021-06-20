import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDiaryPreviewComponent } from './table-diary-preview.component';

describe('TableDiaryPreviewComponent', () => {
  let component: TableDiaryPreviewComponent;
  let fixture: ComponentFixture<TableDiaryPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDiaryPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDiaryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
