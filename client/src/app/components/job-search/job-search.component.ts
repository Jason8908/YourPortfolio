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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButton,
    MatAutocompleteModule,
    CommonModule,
  ],
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.css',
})
export class JobSearchComponent {
  canSubmit: boolean = false;
  currLocation = '';
  cities = [];
  apiDelay = 350;
  currTimeout: any = null;

  @Input() formValues = {
    query: undefined,
    location: undefined,
  };
  @Output() newSearch = new EventEmitter<JobSearchRequest>();

  jobSearch: FormGroup;
  constructor(private fb: FormBuilder, private apiService: ApiService) {
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

    this.jobSearch.valueChanges.subscribe(() => {
      this.canSubmit =
        this.jobSearch.value.query && this.jobSearch.value.location;

      //Check if location value changed
      if (this.currLocation != this.jobSearch.value.location) {
        this.currLocation = this.jobSearch.value.location;
        this.currTimeout && clearTimeout(this.currTimeout);
        this.currTimeout = setTimeout(() => {
          this.updateCities();
        }, this.apiDelay);
      }
    });
  }

  updateCities() {
    if (this.currLocation == '') {
      this.cities = [];
      return;
    }
    console.log(this.currLocation);
    this.apiService.getCities(this.currLocation, 0, 5).subscribe({
      next: (res) => {
        this.cities = res.data.cities;
      },
    });
  }
}
