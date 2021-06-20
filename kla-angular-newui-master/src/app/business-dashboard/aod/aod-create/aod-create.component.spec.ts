import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AodCreateComponent } from './aod-create.component';

describe('AodCreateComponent', () => {
  let component: AodCreateComponent;
  let fixture: ComponentFixture<AodCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AodCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AodCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
