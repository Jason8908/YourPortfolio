export interface UserExperience {
  id: number;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
}

export interface ExperienceList {
  totalCount: number;
  experiences: Array<UserExperience>;
}
