export interface Skill {
  id: number;
  name: string;
}

export interface SkillList {
  totalCount: number;
  skills: Array<Skill>;
}
