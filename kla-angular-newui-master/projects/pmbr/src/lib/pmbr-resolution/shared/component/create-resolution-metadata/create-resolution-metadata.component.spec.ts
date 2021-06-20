import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResolutionMetadataComponent } from './create-resolution-metadata.component';

describe('CreateResolutionMetadataComponent', () => {
  let component: CreateResolutionMetadataComponent;
  let fixture: ComponentFixture<CreateResolutionMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateResolutionMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateResolutionMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
