import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JobSearchRequest } from '../classes/jobSearch';
import { ApiResponse } from '../classes/response';
import { CookieLabels } from '../app.constants';
import { UserExperience } from '../classes/experiences';
import { pipe } from 'rxjs';
import { JobData } from '../classes/job-data';

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

  getUserSkills(
    userId: Number,
    offset = 0,
    limit = 10
  ): Observable<ApiResponse> {
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
    return this.http.delete(
      `${this.endpoint}/api/users/${userId}/skills/${skillId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ) as Observable<ApiResponse>;
  }

  addUserSkill(userId: Number, skillId: Number): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/users/${userId}/skills`,
      { skillId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ) as Observable<ApiResponse>;
  }

  createUserSkill(userId: Number, skillName: string): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/users/${userId}/skills`,
      { skillName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ) as Observable<ApiResponse>;
  }

  getSkills(search = '', offset = 0, limit = 10): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/skills`, {
      params: { offset, limit, search },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  getUserInterests(
    userId: Number,
    offset = 0,
    limit = 10
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/users/${userId}/interests`, {
      params: { offset, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  deleteUserInterest(
    userId: Number,
    interestId: Number
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.delete(
      `${this.endpoint}/api/users/${userId}/interests/${interestId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ) as Observable<ApiResponse>;
  }

  addUserInterest(userId: Number, interest: Number): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/users/${userId}/interests`,
      { interest },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ) as Observable<ApiResponse>;
  }

  getUserExperiences(
    userId: Number,
    offset = 0,
    limit = 5
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/users/${userId}/experiences`, {
      params: { offset, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  updateUserExperience(
    userId: Number,
    userExp: UserExperience
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.patch(
      `${this.endpoint}/api/users/${userId}/experiences/`,
      userExp,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ) as Observable<ApiResponse>;
  }

  deleteUserExperience(
    userId: Number,
    experienceId: Number
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.delete(
      `${this.endpoint}/api/users/${userId}/experiences/${experienceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ) as Observable<ApiResponse>;
  }

  addUserExperience(
    userId: Number,
    experience: UserExperience
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/users/${userId}/experiences`,
      {
        company: experience.company,
        position: experience.position,
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: experience.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ) as Observable<ApiResponse>;
  }

  generateCoverLetter(jobData: JobData) {
    console.log(jobData);
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/gen-ai/letter`,
      {
        jobData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
        responseType: 'arraybuffer',
      },
    ) as Observable<any>;
  }

  saveJob(jobId: number): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post<ApiResponse>(
      `${this.endpoint}/api/jobs/${jobId}/save`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  unsaveJob(jobId: number): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.delete<ApiResponse>(
      `${this.endpoint}/api/jobs/${jobId}/save`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getSavedJobs(offset = 0, limit = 10): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get<ApiResponse>(`${this.endpoint}/api/jobs/saved`, {
      params: { offset, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
