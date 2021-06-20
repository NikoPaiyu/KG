import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjIntroductionComponent } from './obj-introduction.component';

describe('ObjIntroductionComponent', () => {
  let component: ObjIntroductionComponent;
  let fixture: ComponentFixture<ObjIntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjIntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
