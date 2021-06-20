import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdsHeadsGulletinComponent } from './dds-heads-gulletin.component';

describe('DdsHeadsGulletinComponent', () => {
  let component: DdsHeadsGulletinComponent;
  let fixture: ComponentFixture<DdsHeadsGulletinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdsHeadsGulletinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdsHeadsGulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
