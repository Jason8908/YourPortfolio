export interface Education {
  id: number | undefined;
  school: string;
  degree: string | undefined;
  major: string | undefined;
  startDate: Date;
  endDate: Date | undefined;
  gpa: number | undefined;
  description: string | undefined;
  degreeSpecs: Array<string> | undefined;
}

export interface EducationList {
  totalCount: number;
  educations: Array<Education>;
}
