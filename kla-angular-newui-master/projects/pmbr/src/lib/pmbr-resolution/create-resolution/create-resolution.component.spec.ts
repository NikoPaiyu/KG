import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResolutionComponent } from './create-resolution.component';

describe('CreateResolutionComponent', () => {
  let component: CreateResolutionComponent;
  let fixture: ComponentFixture<CreateResolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateResolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
