import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumePrepareComponent } from './resume-prepare.component';

describe('ResumePrepareComponent', () => {
  let component: ResumePrepareComponent;
  let fixture: ComponentFixture<ResumePrepareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumePrepareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumePrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
