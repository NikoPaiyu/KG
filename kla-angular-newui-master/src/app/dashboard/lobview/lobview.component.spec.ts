import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobviewComponent } from './lobview.component';

describe('LobviewComponent', () => {
  let component: LobviewComponent;
  let fixture: ComponentFixture<LobviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
