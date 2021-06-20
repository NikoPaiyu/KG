import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutesPreviewComponent } from './minutes-preview.component';

describe('MinutesPreviewComponent', () => {
  let component: MinutesPreviewComponent;
  let fixture: ComponentFixture<MinutesPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinutesPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinutesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
