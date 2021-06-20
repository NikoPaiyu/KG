import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistergroupListComponent } from './ministergroup-list.component';

describe('MinistergroupListComponent', () => {
  let component: MinistergroupListComponent;
  let fixture: ComponentFixture<MinistergroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistergroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistergroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
