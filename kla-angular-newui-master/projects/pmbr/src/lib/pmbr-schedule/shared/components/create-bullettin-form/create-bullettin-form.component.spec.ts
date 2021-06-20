import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBullettinFormComponent } from './create-bullettin-form.component';

describe('CreateBullettinFormComponent', () => {
  let component: CreateBullettinFormComponent;
  let fixture: ComponentFixture<CreateBullettinFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBullettinFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBullettinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
