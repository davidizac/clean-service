import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressingsComponent } from './pressings.component';

describe('PressingsComponent', () => {
  let component: PressingsComponent;
  let fixture: ComponentFixture<PressingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PressingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PressingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
