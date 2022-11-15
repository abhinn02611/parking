import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersessionsComponent } from './usersessions.component';

describe('UsersessionsComponent', () => {
  let component: UsersessionsComponent;
  let fixture: ComponentFixture<UsersessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
