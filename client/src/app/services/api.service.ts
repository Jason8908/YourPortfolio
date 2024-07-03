import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JobSearchRequest } from '../models/jobSearch';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  sendAuth(
    token: string,
    firstName: string,
    lastName: string,
    email: string
  ): Observable<any> {
    return this.http.post(`${this.endpoint}/api/users/auth`, {
      accessToken: token,
      firstName,
      lastName,
      email,
    });
  }

  getUserInfo(): Observable<any> {
    const token = this.cookieService.get('bearerToken');
    return this.http.get(`${this.endpoint}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getJobs(jobSearchRequest: JobSearchRequest): Observable<any> {
    const token = this.cookieService.get('bearerToken');
    return this.http.get(`${this.endpoint}/api/jobs/search`, {
      params: { ...jobSearchRequest },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
