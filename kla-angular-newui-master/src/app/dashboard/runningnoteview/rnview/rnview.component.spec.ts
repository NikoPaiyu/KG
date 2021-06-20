import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RnviewComponent } from './rnview.component';

describe('RnviewComponent', () => {
  let component: RnviewComponent;
  let fixture: ComponentFixture<RnviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RnviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RnviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
