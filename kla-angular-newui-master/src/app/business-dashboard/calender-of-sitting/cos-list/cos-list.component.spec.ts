import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CosListComponent } from './cos-list.component';

describe('CosListComponent', () => {
  let component: CosListComponent;
  let fixture: ComponentFixture<CosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
