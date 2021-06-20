import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnstarredfolderComponent } from './unstarredfolder.component';

describe('UnstarredfolderComponent', () => {
  let component: UnstarredfolderComponent;
  let fixture: ComponentFixture<UnstarredfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnstarredfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnstarredfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
