import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdgDdsCreateCreateComponent } from './sdg-dds-create.component';

describe('SdgDdsCreateCreateComponent', () => {
  let component: SdgDdsCreateCreateComponent;
  let fixture: ComponentFixture<SdgDdsCreateCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdgDdsCreateCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdgDdsCreateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
