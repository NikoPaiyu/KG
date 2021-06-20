import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjIntroductionListComponent } from './obj-introduction-list.component';

describe('ObjIntroductionListComponent', () => {
  let component: ObjIntroductionListComponent;
  let fixture: ComponentFixture<ObjIntroductionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjIntroductionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjIntroductionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
