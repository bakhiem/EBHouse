import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifiComponent } from './notifi.component';

describe('NotifiComponent', () => {
  let component: NotifiComponent;
  let fixture: ComponentFixture<NotifiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
