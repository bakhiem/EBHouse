import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsInfoComponent } from './rooms-info.component';

describe('RoomsInfoComponent', () => {
  let component: RoomsInfoComponent;
  let fixture: ComponentFixture<RoomsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
