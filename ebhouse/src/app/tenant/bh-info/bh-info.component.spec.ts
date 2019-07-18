import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BhInfoComponent } from './bh-info.component';

describe('BhInfoComponent', () => {
  let component: BhInfoComponent;
  let fixture: ComponentFixture<BhInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BhInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BhInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
