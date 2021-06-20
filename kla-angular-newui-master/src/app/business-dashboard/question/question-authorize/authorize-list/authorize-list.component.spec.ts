import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeListComponent } from './authorize-list.component';

describe('AuthorizeListComponent', () => {
  let component: AuthorizeListComponent;
  let fixture: ComponentFixture<AuthorizeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
