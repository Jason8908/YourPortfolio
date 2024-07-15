export class Resume {
  fName;
  lName;
  email;
  objective = "";
  skills = [];
  educations = [];
  experiences = [];
  constructor(fname, lname, email) {
    this.fName = fname;
    this.lName = lname;
    this.email = email;
  }
  setObjective(objective) {
    this.objective = objective;
  }
  setSkills(skills) {
    this.skills = skills;
  }
  setEducations(educations) {
    this.educations = educations;
  }
  setExperiences(experiences) {
    this.experiences = experiences;
  }
}