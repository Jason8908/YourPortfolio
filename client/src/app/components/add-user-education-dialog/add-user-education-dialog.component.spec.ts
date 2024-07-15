import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserEducationDialogComponent } from './add-user-education-dialog.component';

describe('AddUserEducationDialogComponent', () => {
  let component: AddUserEducationDialogComponent;
  let fixture: ComponentFixture<AddUserEducationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserEducationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserEducationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
