import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelChairmanListComponent } from './panel-chairman-list.component';

describe('PanelChairmanListComponent', () => {
  let component: PanelChairmanListComponent;
  let fixture: ComponentFixture<PanelChairmanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelChairmanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelChairmanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
