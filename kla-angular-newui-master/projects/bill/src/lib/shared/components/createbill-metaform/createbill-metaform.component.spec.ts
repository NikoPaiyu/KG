import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatebillMetaformComponent } from './createbill-metaform.component';

describe('CreatebillMetaformComponent', () => {
  let component: CreatebillMetaformComponent;
  let fixture: ComponentFixture<CreatebillMetaformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatebillMetaformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatebillMetaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
