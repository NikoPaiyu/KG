import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobCreateComponent } from './lob-create.component';

describe('LobCreateComponent', () => {
  let component: LobCreateComponent;
  let fixture: ComponentFixture<LobCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
