import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinPart2Component } from './bulletin-part2.component';

describe('BulletinPart2Component', () => {
  let component: BulletinPart2Component;
  let fixture: ComponentFixture<BulletinPart2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinPart2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinPart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
