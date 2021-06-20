import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FileTabInfoComponent } from "./file-tab-info.component";

describe("FileTabInfoComponent", () => {
  let component: FileTabInfoComponent;
  let fixture: ComponentFixture<FileTabInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileTabInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTabInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
