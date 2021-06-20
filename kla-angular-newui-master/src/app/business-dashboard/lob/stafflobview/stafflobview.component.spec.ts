import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StaffLobViewComponent } from "./stafflobview.component";

describe("LobviewComponent", () => {
  let component: StaffLobViewComponent;
  let fixture: ComponentFixture<StaffLobViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StaffLobViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffLobViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
