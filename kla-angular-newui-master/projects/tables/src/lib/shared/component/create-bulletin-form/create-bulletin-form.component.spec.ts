import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBulletinFormComponent } from './create-bulletin-form.component';

describe('CreateBulletinFormComponent', () => {
  let component: CreateBulletinFormComponent;
  let fixture: ComponentFixture<CreateBulletinFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBulletinFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBulletinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
