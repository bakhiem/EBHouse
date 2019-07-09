import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraFeeComponent } from './extrafee.component';

describe('ExtraFeeComponent', () => {
  let component: ExtraFeeComponent;
  let fixture: ComponentFixture<ExtraFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
