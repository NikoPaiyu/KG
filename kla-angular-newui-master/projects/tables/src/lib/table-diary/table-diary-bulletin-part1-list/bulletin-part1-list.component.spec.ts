import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinPart1ListComponent } from './bulletin-part1-list.component';

describe('BulletinPart1ListComponent', () => {
  let component: BulletinPart1ListComponent;
  let fixture: ComponentFixture<BulletinPart1ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinPart1ListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinPart1ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
