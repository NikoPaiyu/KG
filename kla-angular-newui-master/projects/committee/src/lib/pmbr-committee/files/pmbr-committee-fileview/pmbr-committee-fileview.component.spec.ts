import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmbrCommitteeFileviewComponent } from './pmbr-committee-fileview.component';

describe('PmbrCommitteeFileviewComponent', () => {
  let component: PmbrCommitteeFileviewComponent;
  let fixture: ComponentFixture<PmbrCommitteeFileviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmbrCommitteeFileviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmbrCommitteeFileviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
