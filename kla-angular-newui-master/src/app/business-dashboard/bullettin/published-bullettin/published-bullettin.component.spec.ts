import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedBullettinComponent } from './published-bullettin.component';

describe('PublishedBullettinComponent', () => {
  let component: PublishedBullettinComponent;
  let fixture: ComponentFixture<PublishedBullettinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedBullettinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedBullettinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
