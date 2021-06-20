import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessControllerViewComponent } from './business-controller-view.component';

describe('BusinessControllerViewComponent', () => {
  let component: BusinessControllerViewComponent;
  let fixture: ComponentFixture<BusinessControllerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessControllerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessControllerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
