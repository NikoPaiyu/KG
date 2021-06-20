import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmbrCommitteeComponent } from './pmbr-committee.component';

describe('PmbrCommitteeComponent', () => {
  let component: PmbrCommitteeComponent;
  let fixture: ComponentFixture<PmbrCommitteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmbrCommitteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmbrCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
