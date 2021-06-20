import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmbrCommitteeNomineeComponent } from './pmbr-committee-nominee.component';

describe('PmbrCommitteeNomineeComponent', () => {
  let component: PmbrCommitteeNomineeComponent;
  let fixture: ComponentFixture<PmbrCommitteeNomineeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmbrCommitteeNomineeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmbrCommitteeNomineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
