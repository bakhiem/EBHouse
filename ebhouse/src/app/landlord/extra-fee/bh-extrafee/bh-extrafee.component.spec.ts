import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BhExtrafeeComponent } from './bh-extrafee.component';

describe('BhExtrafeeComponent', () => {
  let component: BhExtrafeeComponent;
  let fixture: ComponentFixture<BhExtrafeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BhExtrafeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BhExtrafeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
