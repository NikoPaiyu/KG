import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConsentsNotieComponent } from "./consents-notice.component";

describe("ConsentsNotieComponent", () => {
  let component: ConsentsNotieComponent;
  let fixture: ComponentFixture<ConsentsNotieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsentsNotieComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentsNotieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
