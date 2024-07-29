import { createReport } from "docx-templates";
import fs from "fs";
import { CoverLetter } from "../entities/cover-letter.js";
import { Resume } from "../entities/resume.js";
import path from "path";

export const CoverLetterTypes = {
  Brown: "brown",
  White: "white",
  Blue: "blue",
};

export const ResumeTypes = {
  Basic: "resume-basic",
  Basic2: "resume-basic-2",
  Basic3: "resume-basic-3"
}

/**
 * Generates a cover letter based on the specified type and cover letter object.
 * @param {string} type - The type of cover letter (e.g., "brown", "white", "blue").
 * @param {CoverLetter} coverLetter - The cover letter object.
 * @returns {Promise<Buffer>} The generated cover letter as a Buffer.
 * @throws {Error} If an invalid cover letter argument is passed to generateCoverLetter().
 * @throws {Error} If an invalid cover letter type is provided.
 */
export const generateCoverLetter = async (coverLetter, type = CoverLetterTypes.Brown) => {
  if (!(coverLetter instanceof CoverLetter))
    throw new Error(
      "Invalid cover letter arugment passed to generateCoverLetter().",
    );
  let templatePath = "";
  switch (type) {
    case CoverLetterTypes.Brown:
      templatePath = TemplatePaths.CoverLetterBrown;
      break;
    case CoverLetterTypes.White:
      templatePath = TemplatePaths.CoverLetterWhite;
      break;
    case CoverLetterTypes.Blue:
      templatePath = TemplatePaths.CoverLetterBlue;
      break;
    default:
      throw new Error(`Invalid cover letter type: ${type}`);
  }
  const template = fs.readFileSync(templatePath);
  const buffer = await createReport({
    template,
    data: coverLetter,
    cmdDelimiter: ["++", "++"],
  });
  return buffer;
}

export const generateResumeBasic = async (resume, type = ResumeTypes.Basic) => {
  if (!(resume instanceof Resume))
    throw new Error(
      "Invalid resume argument passed to generateResumeBasic().",
    );
  let templatePath = "";
  switch (type) {
    case ResumeTypes.Basic:
      templatePath = TemplatePaths.ResumeBasic;
      break;
    case ResumeTypes.Basic2:
      templatePath = TemplatePaths.ResumeBasic2;
      break;
    case ResumeTypes.Basic3:
      templatePath = TemplatePaths.ResumeBasic3;
      break;
    default:
      throw new Error(`Invalid resume type: ${type}`);
  }
  const template = fs.readFileSync(templatePath);
  const buffer = await createReport({
    template,
    data: resume,
    cmdDelimiter: ["+++", "+++"],
  });
  return buffer;
}

export const OutputPaths = {
  CoverLetter: "letters",
};

export const TemplatePaths = {
  CoverLetterBrown: "templates/cover-letter-brown.docx",
  CoverLetterWhite: "templates/cover-letter-white.docx",
  CoverLetterBlue: "templates/cover-letter-blue.docx",
  ResumeBasic: "templates/resume-basic.docx",
  ResumeBasic2: "templates/resume-2.docx",
  ResumeBasic3: "templates/resume-3.docx",
};

