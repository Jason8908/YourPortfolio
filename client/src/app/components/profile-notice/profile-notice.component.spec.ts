import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileNoticeComponent } from './profile-notice.component';

describe('ProfileNoticeComponent', () => {
  let component: ProfileNoticeComponent;
  let fixture: ComponentFixture<ProfileNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileNoticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
