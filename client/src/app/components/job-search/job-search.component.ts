import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { JobSearchRequest } from '../../classes/jobSearch';
import { query } from '@angular/animations';

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
  @Input() formValues = {
    query: undefined,
    location: undefined,
  };
  @Output() newSearch = new EventEmitter<JobSearchRequest>();

  jobSearch: FormGroup;
  constructor(private fb: FormBuilder) {
    this.jobSearch = this.fb.group({
      query: [''],
      location: [''],
    });
  }

  search() {
    this.newSearch.emit({
      query: this.jobSearch.value.query,
      location: this.jobSearch.value.location,
    });
  }

  ngOnInit() {
    if (this.formValues.query) {
      this.jobSearch.setValue(this.formValues);
    }
  }
}
