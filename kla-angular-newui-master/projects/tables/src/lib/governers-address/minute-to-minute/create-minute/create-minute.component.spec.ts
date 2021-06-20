import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMinuteComponent } from './create-minute.component';

describe('CreateMinuteComponent', () => {
  let component: CreateMinuteComponent;
  let fixture: ComponentFixture<CreateMinuteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMinuteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMinuteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
