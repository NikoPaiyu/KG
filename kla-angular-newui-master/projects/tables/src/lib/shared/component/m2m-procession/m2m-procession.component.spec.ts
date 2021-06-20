import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { M2mProcessionComponent } from './m2m-procession.component';

describe('M2mProcessionComponent', () => {
  let component: M2mProcessionComponent;
  let fixture: ComponentFixture<M2mProcessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ M2mProcessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(M2mProcessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
