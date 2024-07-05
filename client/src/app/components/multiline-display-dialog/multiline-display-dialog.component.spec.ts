import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilineDisplayDialogComponent } from './multiline-display-dialog.component';

describe('MultilineDisplayDialogComponent', () => {
  let component: MultilineDisplayDialogComponent;
  let fixture: ComponentFixture<MultilineDisplayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultilineDisplayDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultilineDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
