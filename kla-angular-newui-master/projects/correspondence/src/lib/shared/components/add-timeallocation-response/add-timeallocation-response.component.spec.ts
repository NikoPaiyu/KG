import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimeallocationResponseComponent } from './add-timeallocation-response.component';

describe('AddTimeallocationResponseComponent', () => {
  let component: AddTimeallocationResponseComponent;
  let fixture: ComponentFixture<AddTimeallocationResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimeallocationResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimeallocationResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
