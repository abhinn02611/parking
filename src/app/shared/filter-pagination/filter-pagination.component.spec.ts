import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPaginationComponent } from './filter-pagination.component';

describe('FilterPaginationComponent', () => {
  let component: FilterPaginationComponent;
  let fixture: ComponentFixture<FilterPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
