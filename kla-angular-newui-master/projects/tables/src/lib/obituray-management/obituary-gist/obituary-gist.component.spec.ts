import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObituaryGistComponent } from './obituary-gist.component';

describe('ObituaryGistComponent', () => {
  let component: ObituaryGistComponent;
  let fixture: ComponentFixture<ObituaryGistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObituaryGistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObituaryGistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
