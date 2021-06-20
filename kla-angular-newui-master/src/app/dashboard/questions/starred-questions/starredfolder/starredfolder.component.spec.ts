import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarredfolderComponent } from './starredfolder.component';

describe('StarredfolderComponent', () => {
  let component: StarredfolderComponent;
  let fixture: ComponentFixture<StarredfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarredfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
