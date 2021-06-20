import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnStarredBookletComponent } from './unstarred-booklet.component';

describe('StarredBookletComponent', () => {
  let component: UnStarredBookletComponent;
  let fixture: ComponentFixture<UnStarredBookletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnStarredBookletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnStarredBookletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
