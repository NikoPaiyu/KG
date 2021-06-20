import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResolutionContentComponent } from './create-resolution-content.component';

describe('CreateResolutionContentComponent', () => {
  let component: CreateResolutionContentComponent;
  let fixture: ComponentFixture<CreateResolutionContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateResolutionContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateResolutionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
