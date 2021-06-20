import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdgEgReplyComponent } from './sdg-eg-reply.component';

describe('SdgEgReplyComponent', () => {
  let component: SdgEgReplyComponent;
  let fixture: ComponentFixture<SdgEgReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdgEgReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdgEgReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
