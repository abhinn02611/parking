import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcontactsComponent } from './allcontacts.component';

describe('LoginComponent', () => {
  let component: AllcontactsComponent;
  let fixture: ComponentFixture<AllcontactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllcontactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllcontactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
