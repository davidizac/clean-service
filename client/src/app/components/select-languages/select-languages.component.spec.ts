import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLanguagesComponent } from './select-languages.component';

describe('SelectLanguagesComponent', () => {
  let component: SelectLanguagesComponent;
  let fixture: ComponentFixture<SelectLanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectLanguagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
