import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBillMetaformComponent } from './create-bill-metaform.component';

describe('CreateBillMetaformComponent', () => {
  let component: CreateBillMetaformComponent;
  let fixture: ComponentFixture<CreateBillMetaformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBillMetaformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBillMetaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
