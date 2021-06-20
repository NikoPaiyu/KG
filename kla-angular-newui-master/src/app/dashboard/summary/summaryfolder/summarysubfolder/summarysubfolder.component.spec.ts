import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarysubfolderComponent } from './summarysubfolder.component';

describe('SummarysubfolderComponent', () => {
  let component: SummarysubfolderComponent;
  let fixture: ComponentFixture<SummarysubfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarysubfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarysubfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
