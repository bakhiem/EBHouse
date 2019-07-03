import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromNotificationComponent } from './from-notification.component';

describe('FromNotificationComponent', () => {
  let component: FromNotificationComponent;
  let fixture: ComponentFixture<FromNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
