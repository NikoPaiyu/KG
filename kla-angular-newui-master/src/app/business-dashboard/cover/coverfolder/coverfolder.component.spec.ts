import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverfolderComponent } from './coverfolder.component';

describe('CoverfolderComponent', () => {
  let component: CoverfolderComponent;
  let fixture: ComponentFixture<CoverfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
