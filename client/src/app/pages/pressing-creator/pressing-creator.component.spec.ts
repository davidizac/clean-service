import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressingCreatorComponent } from './pressing-creator.component';

describe('PressingCreatorComponent', () => {
  let component: PressingCreatorComponent;
  let fixture: ComponentFixture<PressingCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PressingCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PressingCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
