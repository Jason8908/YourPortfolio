import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupOptionsComponent } from './topup-options.component';

describe('TopupOptionsComponent', () => {
  let component: TopupOptionsComponent;
  let fixture: ComponentFixture<TopupOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopupOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopupOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
