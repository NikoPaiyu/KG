import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MscfolderComponent } from './mscfolder.component';

describe('MscfolderComponent', () => {
  let component: MscfolderComponent;
  let fixture: ComponentFixture<MscfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MscfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MscfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
