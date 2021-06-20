import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCommitteeFileviewComponent } from './select-committee-fileview.component';

describe('SelectCommitteeFileviewComponent', () => {
  let component: SelectCommitteeFileviewComponent;
  let fixture: ComponentFixture<SelectCommitteeFileviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCommitteeFileviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCommitteeFileviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
