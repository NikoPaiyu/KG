import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AodListComponent } from './aod-list.component';

describe('AodListComponent', () => {
  let component: AodListComponent;
  let fixture: ComponentFixture<AodListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AodListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
