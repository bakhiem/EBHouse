import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectDialogComponent } from './redirect-dialog.component';

describe('RedirectDialogComponent', () => {
  let component: RedirectDialogComponent;
  let fixture: ComponentFixture<RedirectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedirectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
