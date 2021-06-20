import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyElectedMemberComponent } from './assembly-elected-member.component';

describe('AssemblyElectedMemberComponent', () => {
  let component: AssemblyElectedMemberComponent;
  let fixture: ComponentFixture<AssemblyElectedMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyElectedMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyElectedMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
