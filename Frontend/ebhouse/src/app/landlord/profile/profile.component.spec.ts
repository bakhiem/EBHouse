import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordProfileComponent } from './profile.component';

describe('LandlordProfileComponent', () => {
  let component: LandlordProfileComponent;
  let fixture: ComponentFixture<LandlordProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandlordProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandlordProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
