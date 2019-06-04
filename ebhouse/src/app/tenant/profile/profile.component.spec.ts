import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantProfileComponent } from './profile.component';

describe('TenantProfileComponent', () => {
  let component: TenantProfileComponent;
  let fixture: ComponentFixture<TenantProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
