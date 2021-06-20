import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGistComponent } from './add-gist.component';

describe('AddGistComponent', () => {
  let component: AddGistComponent;
  let fixture: ComponentFixture<AddGistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
