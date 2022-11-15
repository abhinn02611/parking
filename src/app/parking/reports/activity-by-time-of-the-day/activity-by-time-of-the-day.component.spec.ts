import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityByTimeOfTheDayComponent } from './activity-by-time-of-the-day.component';

describe('ActivityByTimeOfTheDayComponent', () => {
  let component: ActivityByTimeOfTheDayComponent;
  let fixture: ComponentFixture<ActivityByTimeOfTheDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityByTimeOfTheDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityByTimeOfTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
