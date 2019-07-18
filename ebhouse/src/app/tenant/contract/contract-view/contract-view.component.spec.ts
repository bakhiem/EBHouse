import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractViewComponent } from './contract-view.component';

describe('ContractViewComponent', () => {
  let component: ContractViewComponent;
  let fixture: ComponentFixture<ContractViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
