import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherFinancialComponent } from './other-financial.component';

describe('OtherFinancialComponent', () => {
  let component: OtherFinancialComponent;
  let fixture: ComponentFixture<OtherFinancialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherFinancialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
