import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinListComponent } from './bulletin-list.component';

describe('BulletinListComponent', () => {
  let component: BulletinListComponent;
  let fixture: ComponentFixture<BulletinListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
