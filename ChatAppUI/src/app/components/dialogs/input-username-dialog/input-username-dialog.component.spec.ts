import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputUsernameDialogComponent } from './input-username-dialog.component';

describe('InputUsernameDialogComponent', () => {
  let component: InputUsernameDialogComponent;
  let fixture: ComponentFixture<InputUsernameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputUsernameDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputUsernameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
