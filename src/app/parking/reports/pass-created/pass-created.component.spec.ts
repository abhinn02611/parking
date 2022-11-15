import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassCreatedComponent } from './pass-created.component';

describe('PassCreatedComponent', () => {
  let component: PassCreatedComponent;
  let fixture: ComponentFixture<PassCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassCreatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
