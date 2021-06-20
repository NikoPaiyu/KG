import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReporterMetadataComponent } from './create-reporter-metadata.component';

describe('CreateReporterMetadataComponent', () => {
  let component: CreateReporterMetadataComponent;
  let fixture: ComponentFixture<CreateReporterMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReporterMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReporterMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
