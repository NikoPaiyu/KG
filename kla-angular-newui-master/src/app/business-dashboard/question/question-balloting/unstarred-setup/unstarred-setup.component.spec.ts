import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnstarredSetupComponent } from './unstarred-setup.component';

describe('UnstarredSetupComponent', () => {
  let component: UnstarredSetupComponent;
  let fixture: ComponentFixture<UnstarredSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnstarredSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnstarredSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
