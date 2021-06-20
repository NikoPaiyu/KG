import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdsSuggetionComponent } from './dds-suggetion.component';

describe('DdsSuggetionComponent', () => {
  let component: DdsSuggetionComponent;
  let fixture: ComponentFixture<DdsSuggetionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdsSuggetionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdsSuggetionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
