import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordDashboardComponent } from './dashboard.component';

describe('LandlordDashboardComponent', () => {
  let component: LandlordDashboardComponent;
  let fixture: ComponentFixture<LandlordDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandlordDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandlordDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
