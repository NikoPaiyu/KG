import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDelayStatementListComponent } from './create-delay-statement-list.component';

describe('CreateDelayStatementListComponent', () => {
  let component: CreateDelayStatementListComponent;
  let fixture: ComponentFixture<CreateDelayStatementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDelayStatementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDelayStatementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
