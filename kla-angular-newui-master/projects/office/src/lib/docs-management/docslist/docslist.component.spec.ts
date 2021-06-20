import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocslistComponent } from './docslist.component';

describe('DocslistComponent', () => {
  let component: DocslistComponent;
  let fixture: ComponentFixture<DocslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
