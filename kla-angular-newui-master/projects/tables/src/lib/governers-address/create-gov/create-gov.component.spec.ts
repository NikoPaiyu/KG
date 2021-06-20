import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGovComponent } from './create-gov.component';

describe('CreateGovComponent', () => {
  let component: CreateGovComponent;
  let fixture: ComponentFixture<CreateGovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
