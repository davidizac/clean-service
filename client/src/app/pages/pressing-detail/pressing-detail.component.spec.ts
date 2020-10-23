import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PressingDetailComponent } from './pressing-detail.component';

describe('PressingDetailComponent', () => {
  let component: PressingDetailComponent;
  let fixture: ComponentFixture<PressingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PressingDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PressingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
