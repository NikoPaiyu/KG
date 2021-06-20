import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorisationsComponent } from './authorisations.component';

describe('AuthorisationsComponent', () => {
  let component: AuthorisationsComponent;
  let fixture: ComponentFixture<AuthorisationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorisationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
