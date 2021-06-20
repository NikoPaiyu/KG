import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachToFileComponent } from './attach-to-file.component';

describe('AttachToFileComponent', () => {
  let component: AttachToFileComponent;
  let fixture: ComponentFixture<AttachToFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachToFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachToFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
