import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllleadsComponent } from './allleads.component';

describe('LoginComponent', () => {
  let component: AllleadsComponent;
  let fixture: ComponentFixture<AllleadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllleadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllleadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
