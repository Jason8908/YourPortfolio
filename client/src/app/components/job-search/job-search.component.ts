import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButton,
  ],
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.css',
})
export class JobSearchComponent {
  jobSearch: FormGroup;
  constructor(private fb: FormBuilder) {
    this.jobSearch = this.fb.group({
      query: [''],
      location: [''],
    });
  }

  search() {}
}
