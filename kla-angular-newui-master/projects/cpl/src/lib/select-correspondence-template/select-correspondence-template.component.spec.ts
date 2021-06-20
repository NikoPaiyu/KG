import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCorrespondenceTemplateComponent } from './select-correspondence-template.component';

describe('SelectCorrespondenceTemplateComponent', () => {
  let component: SelectCorrespondenceTemplateComponent;
  let fixture: ComponentFixture<SelectCorrespondenceTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCorrespondenceTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCorrespondenceTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
