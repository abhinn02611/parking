import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopVehicleCategoryComponent } from './top-vehicle-category.component';

describe('TopVehicleCategoryComponent', () => {
  let component: TopVehicleCategoryComponent;
  let fixture: ComponentFixture<TopVehicleCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopVehicleCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopVehicleCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
