import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JobSearchRequest } from '../models/jobSearch';
import { ApiResponse } from '../classes/response';
import { CookieLabels } from '../app.constants';

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

  getUserInfo(): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  getJobs(jobSearchRequest: JobSearchRequest): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/jobs/search`, {
      params: { ...jobSearchRequest },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  getUserSkills(userId: Number, offset=0, limit=10): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/users/${userId}/skills`, {
      params: { offset, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  deleteUserSkill(userId: Number, skillId: Number): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.delete(`${this.endpoint}/api/users/${userId}/skills/${skillId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  addUserSkill(userId: Number, skillId: Number): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(`${this.endpoint}/api/users/${userId}/skills`, { skillId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  createUserSkill(userId: Number, skillName: string): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(`${this.endpoint}/api/users/${userId}/skills`, { skillName }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  getSkills(search="", offset=0, limit=10): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/skills`, {
      params: { offset, limit, search },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }
}
