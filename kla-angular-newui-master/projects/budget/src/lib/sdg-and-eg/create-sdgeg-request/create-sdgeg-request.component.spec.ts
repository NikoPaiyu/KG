import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSdgegRequestComponent } from './create-sdgeg-request.component';

describe('CreateSdgegRequestComponent', () => {
  let component: CreateSdgegRequestComponent;
  let fixture: ComponentFixture<CreateSdgegRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSdgegRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSdgegRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
