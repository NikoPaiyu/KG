import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdgEgListComponent } from './sdg-eg-list.component';

describe('SdgEgListComponent', () => {
  let component: SdgEgListComponent;
  let fixture: ComponentFixture<SdgEgListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdgEgListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdgEgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
