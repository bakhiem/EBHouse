import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricComponent } from './electric.component';

describe('ElectricComponent', () => {
  let component: ElectricComponent;
  let fixture: ComponentFixture<ElectricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
