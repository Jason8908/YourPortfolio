import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserExperienceDialogComponent } from './add-user-experience-dialog.component';

describe('AddUserExperienceDialogComponent', () => {
  let component: AddUserExperienceDialogComponent;
  let fixture: ComponentFixture<AddUserExperienceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserExperienceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserExperienceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
