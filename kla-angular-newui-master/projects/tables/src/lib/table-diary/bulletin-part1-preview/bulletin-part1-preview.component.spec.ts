import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinPart1PreviewComponent } from './bulletin-part1-preview.component';

describe('BulletinPart1PreviewComponent', () => {
  let component: BulletinPart1PreviewComponent;
  let fixture: ComponentFixture<BulletinPart1PreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinPart1PreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinPart1PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
