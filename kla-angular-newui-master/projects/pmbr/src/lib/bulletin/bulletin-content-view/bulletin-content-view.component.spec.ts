import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinContentViewComponent } from './bulletin-content-view.component';

describe('BulletinContentViewComponent', () => {
  let component: BulletinContentViewComponent;
  let fixture: ComponentFixture<BulletinContentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinContentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
