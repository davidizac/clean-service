import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpWhatsappComponent } from './pop-up-whatsapp.component';

describe('PopUpWhatsappComponent', () => {
  let component: PopUpWhatsappComponent;
  let fixture: ComponentFixture<PopUpWhatsappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpWhatsappComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
