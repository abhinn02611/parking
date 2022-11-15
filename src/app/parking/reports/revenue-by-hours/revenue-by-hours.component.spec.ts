import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueByHoursComponent } from './revenue-by-hours.component';

describe('RevenueByHoursComponent', () => {
  let component: RevenueByHoursComponent;
  let fixture: ComponentFixture<RevenueByHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueByHoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueByHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
