import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdsCreateComponent } from './dds-create.component';

describe('DdsCreateComponent', () => {
  let component: DdsCreateComponent;
  let fixture: ComponentFixture<DdsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
