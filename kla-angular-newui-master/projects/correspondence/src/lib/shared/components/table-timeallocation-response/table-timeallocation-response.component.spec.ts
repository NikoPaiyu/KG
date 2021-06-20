import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTimeallocationResponseComponent } from './table-timeallocation-response.component';

describe('TableTimeallocationResponseComponent', () => {
  let component: TableTimeallocationResponseComponent;
  let fixture: ComponentFixture<TableTimeallocationResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTimeallocationResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTimeallocationResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
