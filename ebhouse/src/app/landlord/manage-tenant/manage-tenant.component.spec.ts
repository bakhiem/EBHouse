import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTenantComponent } from './manage-tenant.component';

describe('ManageTenantComponent', () => {
  let component: ManageTenantComponent;
  let fixture: ComponentFixture<ManageTenantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTenantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
