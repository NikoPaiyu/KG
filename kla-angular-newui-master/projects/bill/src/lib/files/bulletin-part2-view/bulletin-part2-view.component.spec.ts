import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinPart2ViewComponent } from './bulletin-part2-view.component';

describe('BulletinPart2ViewComponent', () => {
  let component: BulletinPart2ViewComponent;
  let fixture: ComponentFixture<BulletinPart2ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinPart2ViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinPart2ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
