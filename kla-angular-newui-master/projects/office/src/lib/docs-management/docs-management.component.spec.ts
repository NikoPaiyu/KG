import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsManagementComponent } from './docs-management.component';

describe('DocsManagementComponent', () => {
  let component: DocsManagementComponent;
  let fixture: ComponentFixture<DocsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
