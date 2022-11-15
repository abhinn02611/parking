import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsheaderComponent } from './detailsheader.component';

describe('DetailsheaderComponent', () => {
  let component: DetailsheaderComponent;
  let fixture: ComponentFixture<DetailsheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
