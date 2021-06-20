import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdgegGrlReplyComponent } from './sdgeg-grl-reply.component';

describe('SdgegGrlReplyComponent', () => {
  let component: SdgegGrlReplyComponent;
  let fixture: ComponentFixture<SdgegGrlReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdgegGrlReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdgegGrlReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
