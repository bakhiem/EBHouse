import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToNotificationComponent } from './to-notification.component';

describe('ToNotificationComponent', () => {
  let component: ToNotificationComponent;
  let fixture: ComponentFixture<ToNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
