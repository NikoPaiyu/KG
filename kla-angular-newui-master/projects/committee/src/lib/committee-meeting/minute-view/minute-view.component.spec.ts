import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinuteViewComponent } from './minute-view.component';

describe('MinuteViewComponent', () => {
  let component: MinuteViewComponent;
  let fixture: ComponentFixture<MinuteViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinuteViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinuteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
