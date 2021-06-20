import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatedBillsComponent } from './translated-bills.component';

describe('TranslatedBillsComponent', () => {
  let component: TranslatedBillsComponent;
  let fixture: ComponentFixture<TranslatedBillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslatedBillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatedBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
