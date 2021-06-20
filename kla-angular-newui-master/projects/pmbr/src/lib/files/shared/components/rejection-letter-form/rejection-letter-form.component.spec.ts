import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionLetterFormComponent } from './rejection-letter-form.component';

describe('RejectionLetterFormComponent', () => {
  let component: RejectionLetterFormComponent;
  let fixture: ComponentFixture<RejectionLetterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionLetterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionLetterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
