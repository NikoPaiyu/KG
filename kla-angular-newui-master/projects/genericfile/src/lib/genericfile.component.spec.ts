import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericfileComponent } from './genericfile.component';

describe('GenericfileComponent', () => {
  let component: GenericfileComponent;
  let fixture: ComponentFixture<GenericfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
