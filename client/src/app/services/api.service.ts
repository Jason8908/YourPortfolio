import { Injectable, model } from '@angular/core';
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
import { AIModels } from '../constants/ai-models';
import { Education } from '../classes/education';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  endpoint = environment.apiEndpoint;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {}

  sendAuth(
    token: string,
    firstName: string,
    lastName: string,
    email: string,
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
    offset = 0,
    limit = 10,
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/users/skills`, {
      params: { offset, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  deleteUserSkill(skillId: Number): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.delete(
      `${this.endpoint}/api/users/skills/${skillId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ) as Observable<ApiResponse>;
  }

  addUserSkill(skillId: Number): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/users/skills`,
      { skillId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ) as Observable<ApiResponse>;
  }

  createUserSkill(skillName: string): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/users/skills`,
      { skillName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
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
    offset = 0,
    limit = 10,
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/users/interests`, {
      params: { offset, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  deleteUserInterest(
    interestId: Number,
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.delete(
      `${this.endpoint}/api/users/interests/${interestId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ) as Observable<ApiResponse>;
  }

  addUserInterest(interest: Number): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/users/interests`,
      { interest },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ) as Observable<ApiResponse>;
  }

  getUserExperiences(
    offset = 0,
    limit = 5,
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/users/experiences`, {
      params: { offset, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  updateUserExperience(
    userExp: UserExperience,
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.patch(
      `${this.endpoint}/api/users/experiences/`,
      userExp,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ) as Observable<ApiResponse>;
  }

  deleteUserExperience(
    experienceId: Number,
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.delete(
      `${this.endpoint}/api/users/experiences/${experienceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ) as Observable<ApiResponse>;
  }

  addUserExperience(
    experience: UserExperience,
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/users/experiences`,
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
      },
    ) as Observable<ApiResponse>;
  }

  generateCoverLetter(
    jobData: JobData,
    selectedAIModel: string = AIModels.Gemini15Flash,
    selectedTemplate: string = 'brown',
  ): Observable<any> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/gen-ai/letter`,
      {
        jobData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
        params: {
          model: selectedAIModel,
          type: selectedTemplate,
        },
        responseType: 'arraybuffer',
      },
    ) as Observable<any>;
  }

  generateResume(
    jobData: JobData,
    selectedAIModel: string = AIModels.Gemini15Flash,
    selectedTemplate: string = 'resume-basic',
  ): Observable<any> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/gen-ai/resume`,
      {
        jobData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
        params: {
          model: selectedAIModel,
          type: selectedTemplate
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
      },
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
      },
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

  getUserBalance(): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get<ApiResponse>(`${this.endpoint}/api/users/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getTopUpOptions(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.endpoint}/api/products/topup`);
  }

  createCheckoutUrl(priceId: string): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post<ApiResponse>(
      `${this.endpoint}/api/stripe/checkout`,
      { priceId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  getUserEducation(
    offset = 0,
    limit = 5,
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.get(`${this.endpoint}/api/users/education`, {
      params: { offset, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as Observable<ApiResponse>;
  }

  addUserEducation(education: Education
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.post(
      `${this.endpoint}/api/users/education`,
      education,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ) as Observable<ApiResponse>;
  }

  updateUserEducation(
    updateInformation: Education,
    educationId: number,
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.patch(
      `${this.endpoint}/api/users/education/${educationId}`,
      updateInformation,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ) as Observable<ApiResponse>;
  }

  deleteUserEducation(
    educationId: number,
  ): Observable<ApiResponse> {
    const token = this.cookieService.get(CookieLabels.AUTH_TOKEN);
    return this.http.delete(
      `${this.endpoint}/api/users/education/${educationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ) as Observable<ApiResponse>;
  }
}
