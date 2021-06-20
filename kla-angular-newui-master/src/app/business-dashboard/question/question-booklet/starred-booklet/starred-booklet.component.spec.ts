import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarredBookletComponent } from './starred-booklet.component';

describe('StarredBookletComponent', () => {
  let component: StarredBookletComponent;
  let fixture: ComponentFixture<StarredBookletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarredBookletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredBookletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
