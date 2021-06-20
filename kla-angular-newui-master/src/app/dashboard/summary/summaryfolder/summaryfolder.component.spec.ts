import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryfolderComponent } from './summaryfolder.component';

describe('SummaryfolderComponent', () => {
  let component: SummaryfolderComponent;
  let fixture: ComponentFixture<SummaryfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
