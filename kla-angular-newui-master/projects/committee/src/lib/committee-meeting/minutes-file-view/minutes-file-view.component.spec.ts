import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinutesFileViewComponent } from './minutes-file-view.component';

describe('MinutesFileViewComponent', () => {
  let component: MinutesFileViewComponent;
  let fixture: ComponentFixture<MinutesFileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinutesFileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinutesFileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
