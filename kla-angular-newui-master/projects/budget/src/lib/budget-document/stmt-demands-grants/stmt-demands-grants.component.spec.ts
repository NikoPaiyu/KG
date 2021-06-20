import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StmtDemandsGrants } from './stmt-demands-grants.component';

describe('StmtDemandsGrants', () => {
  let component: StmtDemandsGrants;
  let fixture: ComponentFixture<StmtDemandsGrants>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StmtDemandsGrants ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StmtDemandsGrants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
