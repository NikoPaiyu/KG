import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinPart1Component } from './bulletin-part1.component';

describe('BulletinPart1Component', () => {
  let component: BulletinPart1Component;
  let fixture: ComponentFixture<BulletinPart1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinPart1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinPart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
