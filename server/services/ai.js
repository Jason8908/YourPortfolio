import { VertexAI } from "@google-cloud/vertexai";
import { Resume } from "../entities/resume.js";

const ModelToCost = {
  "gemini-1.5-flash-001": 0,
  "gemini-1.5-pro-001": 1,
};

export class AiResponse {
  constructor(response, model) {
    this.response = response;
    this.cost = model in ModelToCost ? ModelToCost[model] : 0;
  }
}

export class AiService {
  constructor(options) {
    this.projectId = options.projectId;
    this.region = options.region;
    if (!this.projectId || !this.region)
      throw new Error("projectId and region are required.");
    this.vertexAI = new VertexAI({ project: this.projectId, location: this.region });
    this.init(options);
  }
  init(options) {
    // Configuration
    const maxOutput = options.maxOutput || 256;
    const model = options.aiModel || "gemini-1.5-flash-001";
    this.model = model;
    const generationConfig = {
      maxOutputTokens: maxOutput
    }
    // Set the model to use for generation
    this.model = this.vertexAI.getGenerativeModel({
      model,
      generationConfig
    });
  }
  async promptText(prompt) {
    if (!this.model)
      throw new Error("Model not initialized. Init model first using the .init() method.");
    const resp = await this.model.generateContent(prompt);
    const content = resp.response;
    const lines = content?.candidates?.at(0)?.content?.parts?.at(0)?.text?.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    return {
      response: lines
    }
  }
  async promptJSON(prompt) {
    if (!this.model)
      throw new Error("Model not initialized. Init model first using the .init() method.");
    const resp = await this.model.generateContent(prompt);
    const content = resp.response;
    const result = content?.candidates?.at(0)?.content?.parts?.at(0)?.text;
    try {
      let parsedResult = JSON.parse(result.match(/\{[\s\S]+\}/)[0]);
      return parsedResult;
    } catch (error) {
      return {
        error,
      };
    }
  }
  startChat() {
    if (!this.model)
      throw new Error("Model not initialized. Init model first using the .init() method.");
    this.chat = this.model.startChat();
  }
  async sendMessage(message) {
    if (!this.chat)
      throw new Error("Chat not started. Start chat first using the .startChat() method.");
    const resp = await this.chat.sendMessage(message);
    const content = resp.response;
    const lines = content?.candidates?.at(0)?.content?.parts?.at(0)?.text?.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    return {
      response: lines
    }
  }
  async generateCoverLetter(user, skills, experiences, jobData) {
    const experiencesString = this.createUserExperienceString(experiences);
    const jobDataString = this.createJobDataString(jobData);
    // LLM Prompt to generate cover letter
    const prompt = `My name is ${user.fname} ${user.lname}. Write a cover letter for me; do not place any tokens in it.\n
      ${jobDataString ? `The following is the job posting: \n${jobDataString}. \n` : ""}
      ${skills.length > 0 ? `My Skills: ${skills.join(", ")}. \n` : ""}
      ${experiencesString.length > 0 ? `Experiences: ${experiencesString}. \n` : ""}
      Do not include any text other than the actual cover letter itself.\n
      Do not include any placeholders or text that I may need to replace; absolutely NO '[' or ']' symbols; if there is missing information, make it generic and generally applicable.\n
      The cover letter must have an introduction, two body paragraphs, and a conclusion.\n
      Do NOT include the location where the job posting was found.\n
      Do NOT include the introductory line "Dear Hiring Manager" or the farewell line.\n`;
    const paragraphs = (await this.promptText(prompt)).response;
    return new AiResponse(paragraphs, this.model);
  }
  async generateResume(user, skills, experiences, educations, jobData) {
    const jobDataString = this.createJobDataString(jobData);
    // Creating a resume object
    const resume = new Resume(user.fname, user.lname, user.email);
    const resumePrompt = this.constructResumePrompt(jobDataString, skills, experiences, educations);
    // Generate resume information using the prompt
    const resumeData = await this.promptJSON(resumePrompt);
    if (!this.validateResumeJSON(resumeData))
      return await this.generateResumeComponents(user, skills, experiences, educations, jobData);
    return this.parseResumeJSON(resume, resumeData, { educations, experiences });
  }
  async generateResumeComponents(user, skills, experiences, educations, jobData) {
    const jobDataString = this.createJobDataString(jobData);
    // Creating a resume object
    const resume = new Resume(user.fname, user.lname, user.email);
    // Starting the AI chat
    await this.startResumeChat(jobDataString);
    // Objective
    const objective = await this.generateResumeObjective();
    resume.setObjective(objective);
    // Skills
    const resumeSkills = await this.generateResumeSkills(skills);
    resume.setSkills(resumeSkills);
    // Education
    const resumeEducations = await this.generateResumeEducations(educations);
    resume.setEducations(resumeEducations);
    // Experiences
    const resumeExperiences = await this.generateResumeExperiences(experiences);
    resume.setExperiences(resumeExperiences);
    return resume;
  }
  async startResumeChat(jobDataString) {
    this.startChat();
    const prompt = `Here is a job posting: ${jobDataString}\n
                    I will ask you a series of questions to generate a resume that fits this job posting.\n
                    Do not send any text other than the answers to the questions.\n
                    Respond with only 'OK' to start.\n`;
    const resp = await this.sendMessage(prompt);
    return resp.response;
  }
  async generateResumeObjective() {
    if (!this.chat)
      throw new Error("Chat not started. Start chat first using the .startChat() method.");
    const prompt = `Generate an objective statement for the job posting mentioned previously that will be put on a resume.\n
                  Do not send any text other than the obejctive statement itself.\n`;
    const resp = await this.sendMessage(prompt);
    return resp.response;
  }
  async generateResumeSkills(skills) {
    if (!this.chat)
      throw new Error("Chat not started. Start chat first using the .startChat() method.");
    const prompt = `Here is a list of skills that I possess: ${skills.join(", ")}\n
                    Generate a list of exactly 6 skills that are relevant to the job posting seperated by commas.
                    Do not send any text other than the skills as comma serpated values.\n`;
    const resp = await this.sendMessage(prompt);
    const result = resp.response[0].split(",").map(item => item.trim());
    return result;
  }
  async generateResumeEducations(educations) {
    if (!this.chat)
      throw new Error("Chat not started. Start chat first using the .startChat() method.");
    const educationOptions = this.generateEducationOptionsString(educations);
    const prompt = `Here is a list of my education: ${educationOptions}\n
                    Generate a list of at most 3 education entries that are most relevant to the job posting.\n
                    Return this data as a list of numbers representing the order in which the options were presented in seperated by commas.\n
                    Do not send any text other than the numbers themselves.\n`;
    const resp = await this.sendMessage(prompt);
    const result = resp.response;
    const educationIndices = result[0].split(",").map(item => +(item.trim())).filter(item => !isNaN(item));
    // Extracting the selected educations
    const selectedEducations = educations.filter((_, index) => educationIndices.includes(index + 1));
    let resumeEducations = [];
    for (const education of selectedEducations) {
      const degreeArr = [education.degree, education.major].filter(item => item);
      const startDateString = this.formatDate(education.startDate);
      const endDateString = education.endDate ? this.formatDate(education.endDate) : "Present";
      resumeEducations.push({
        degree: degreeArr.join(", "),
        institution: education.school,
        startDate: startDateString,
        endDate: endDateString,
        points: [education.description],
      });
    }
    return resumeEducations;
  }
  async generateResumeExperiences(experiences) {
    if (!this.chat)
      throw new Error("Chat not started. Start chat first using the .startChat() method.");
    const experienceOptions = this.generateExperienceOptionsString(experiences);
    const prompt = `Here is a list of my experiences: ${experienceOptions}\n
                    Generate a list of at most 3 experience entries that are most relevant to the job posting.\n
                    Return this data as a list of numbers representing the order in which the options were presented in seperated by commas.\n
                    Do not send any text other than the numbers themselves.\n`;
    const resp = await this.sendMessage(prompt);
    const result = resp.response;
    const experienceIndices = result[0].split(",").map(item => +(item.trim()));
    // Extracting the selected experiences
    const selectedExperiences = experiences.filter((_, index) => experienceIndices.includes(index + 1));
    let resumeExperiences = [];
    for (const experience of selectedExperiences) {
      const experienceString = this.generateExperienceString(experience);
      const experiencePointsPrompt = `Here is an experience I have: ${experienceString}\n
                                      Generate a list of at most 5 bullet points that describe this experience.\n
                                      To the best of your ability, extrapolate information from my experience that may be relevant to the job posting.\n
                                      However, make the points relevant to the job posting.\n
                                      Return this data as a list of sentences seperated by new lines.\n
                                      Do not send any text other than the sentences themselves.\n`;
      const expResp = await this.sendMessage(experiencePointsPrompt);
      const points = expResp.response;
      const startDateString = this.formatDate(experience.startDate);
      const endDateString = experience.endDate ? this.formatDate(experience.endDate) : "Present";
      resumeExperiences.push({
        position: experience.position,
        company: experience.company,
        startDate: startDateString,
        endDate: endDateString,
        points,
      });
    }
    return resumeExperiences;
  }


  parseResumeJSON(resume, resumeData, userInfo) {
    const educations = userInfo?.educations || [];
    const experiences = userInfo?.experiences || [];
    // Objective
    resume.setObjective(resumeData.objective);
    // Skills
    resume.setSkills(resumeData.skills);
    // Education
    const resumeEducations = this.extractResumeEducations(resumeData.education, educations);
    resume.setEducations(resumeEducations);
    // Experiences
    const resumeExperiences = this.extractResumeExperiences(resumeData.experience, experiences);
    resume.setExperiences(resumeExperiences);
    return resume;
  }
  validateResumeJSON(resumeData) {
    /*
      Validates the resume JSON object.
      The resume object must have the following fields:
      - objective: string
      - skills: array of strings
      - education: array of numbers
      - experience: object with keys as numbers and values as arrays of strings
    */
    const requiredFields = ["objective", "skills", "education", "experience"];
    const keys = Object.keys(resumeData);
    if (!resumeData || typeof resumeData !== "object" || resumeData.error)
      return false;
    for (const field of requiredFields) {
      if (!keys.includes(field))
        return false;
    }
    // Objective
    if (typeof resumeData.objective !== "string")
      return false;
    // Skills
    if (!Array.isArray(resumeData.skills) || resumeData.skills.some((skill) => typeof skill !== "string"))
      return false;
    // Education
    if (!Array.isArray(resumeData.education) || resumeData.education.some((education) => typeof education !== "number"))
      return false;
    // Experience, must be an object with keys as numbers and values as arrays of strings
    if (typeof resumeData.experience !== "object")
      return false;
    for (const key in resumeData.experience) {
      if (isNaN(key) || !Array.isArray(resumeData.experience[key]) || resumeData.experience[key].some((point) => typeof point !== "string"))
        return false;
    }
    // If all checks pass, return true
    return true;
  }
  extractResumeObjective(response) {
    let objective = "";
    let start = false;
    for (const line of response) {
      if (line === "=====[1].=====") {
        start = true;
        continue;
      }
      if (line === "==========" && start) {
        start = false;
        break;
      }
      if (start)
        objective += line + "\n";
    }
    return objective.trim();
  }
  extractResumeSkills(response) {
    let skills = [];
    let start = false;
    for (const line of response) {
      if (line === "=====[2].=====") {
        start = true;
        continue;
      }
      if (line === "==========" && start) {
        start = false;
        break;
      }
      if (start)
        skills.push(...(line.split(",").map(item => item.trim())));
    }
    return skills;
  }
  extractResumeEducations(educationIndices, educations) {
    // Extracting the selected educations
    const selectedEducations = educations.filter((_, index) => educationIndices.includes(index + 1));
    let resumeEducations = [];
    for (const education of selectedEducations) {
      const degreeArr = [education.degree, education.major].filter(item => item);
      const startDateString = this.formatDate(education.startDate);
      const endDateString = education.endDate ? this.formatDate(education.endDate) : "Present";
      resumeEducations.push({
        degree: degreeArr.join(", "),
        institution: education.school,
        startDate: startDateString,
        endDate: endDateString,
        points: [education.description],
      });
    }
    return resumeEducations;
  }
  extractResumeExperiences(experienceResponse, experiences) {
    const selectedIndices = Object.keys(experienceResponse).map((key) => +(key)).filter(key => !isNaN(key));
    let resumeExperiences = [];
    // Extracting the selected experiences
    const selectedExperiences = experiences.map((exp, index) => {
      if (selectedIndices.includes(index + 1))
        return {
          ...exp,
          points: experienceResponse[index + 1],
        };
      return exp;
    }).filter((_, index) => selectedIndices.includes(index + 1));
    // Constructing the resume experiences
    for (const experience of selectedExperiences) {
      const startDateString = this.formatDate(experience.startDate);
      const endDateString = experience.endDate ? this.formatDate(experience.endDate) : "Present";
      resumeExperiences.push({
        position: experience.position,
        company: experience.company,
        startDate: startDateString,
        endDate: endDateString,
        points: experience.points || [],
      });
    }
    // Return the resume experiences
    return resumeExperiences;
  }
  createUserExperienceString(experiences) {
    return experiences
      .map((experience) => {
        const startDate = experience.startDate.toLocaleDateString();
        const endDate = experience.endDate
          ? experience.endDate.toLocaleDateString()
          : "Present";
        return `${experience.position} at ${experience.company} from ${startDate} to ${endDate}. Description: ${experience.description}`;
      })
      .join("\n");
  }
  createJobDataString(jobData) {
    if (!jobData) return "";
    const position = jobData.title || "";
    const company = jobData.employer || "";
    let description = (jobData.description || "").split("\n");
    for (let i = 0; i < description.length; i++) {
      description[i] = description[i].trim();
      description[i] = description[i].replace(/<[^>]*>?/gm, "");
    }
    return `${position || "Some position"} at ${company || "some company"}. Description: ${description.join("\n")}`;
  }
  generateEducationOptionsString(educations) {
    let result = "";
    for (let i = 0; i < educations.length; i++)
      result += `${i+1}. ${educations[i].degree} in ${educations[i].major} at ${educations[i].school}\n`;
    return result;
  }
  generateExperienceOptionsString(experiences) {
    let result = "";
    for (let i = 0; i < experiences.length; i++)
      result += `${i+1}. ${experiences[i].position} at ${experiences[i].company}\n`;
    return result;
  }
  generateExperienceString = (experience) => {
    const startDate = experience.startDate.toLocaleDateString();
    const endDate = experience.endDate ? experience.endDate.toLocaleDateString() : "Present";
    return `${experience.position} at ${experience.company} from ${startDate} to ${endDate}.`;
  }
  constructResumePrompt(jobDataString, skills, experiences, educations) {
    const educationOptions = this.generateEducationOptionsString(educations);
    const experienceOptions = this.generateExperienceOptionsString(experiences);
    const prompt = `Here is a job posting: ${jobDataString}\n
                    I will ask you a series of questions to generate a resume that fits this job posting.\n
                    Very Important: Ensure the response is valid JSON and do not send any response that is not valid JSON.\n
                    For each qusestion, you will be provided with the field that your response should be placed in as well as the data that should be placed in that field.\n
                    Here are the questions:\n
                    1. Generate an objective statement for the job posting mentioned previously that will be put on a resume.\n
                    The returned data must be a single string placed in a field labelled EXACTLY "objective".\n
                    2. Here is a list of skills that I possess: ${skills.join(", ")}\n
                    Generate a list of exactly 6 skills that are relevant to the job posting in conjunction with the ones I possess already.\n
                    The returned data must be an array of exactly six strings, one per skill, and the data must go in a field labelled "skills".\n
                    3. Here is a list of my previous education: ${educationOptions}\n
                    Generate a list of at most 3 education entries that are most relevant to the job posting.\n
                    The returned data must be an array of integers corresponding to the options that you were given and the data must go in a field labelled "education".\n
                    4. Here is a list of my experiences: ${experienceOptions}\n
                    Generate a list of at most 3 experience entries that are most relevant to the job posting.\n
                    For each of these entries, generate a list of at most 3 bullet points that describe this experience.\n
                    To the best of your ability, extrapolate information from my experience that may be relevant to the job posting.\n
                    However, make the points relevant to the job posting.\n
                    The data must be placed in a field labelled "experience".\n
                    The returned data must be an object with one entry for each experience that you selected.\n
                    For each entry, its key must be the number of the experience and the value must be an array of strings, one per bullet point.\n\n
                    Those are all the questions, remember DO NOT return anything that is not valid JSON.\n`;
    return prompt;
  }
  getCost() {
    return ModelToCost[this.model];
  }
  formatDate = (date) => {
    // Return the date in the format "Month Year"
    return `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
  }
}