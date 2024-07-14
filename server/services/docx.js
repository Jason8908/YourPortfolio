import { createReport } from "docx-templates";
import fs from "fs";
import { CoverLetter } from "../entities/cover-letter.js";
import path from "path";

/**
 * Generates a cover letter using the provided `coverLetter` object.
 *
 * @param {CoverLetter} coverLetter - The cover letter object to generate the cover letter from.
 * @returns {Buffer} The generated cover letter as a buffer.
 * @throws {Error} If an invalid cover letter argument is passed.
 */
export const generateCoverLetterBrown = async (coverLetter) => {
  if ((!coverLetter) instanceof CoverLetter)
    throw new Error(
      "Invalid cover letter arugment passed to generateCoverLetterBrown().",
    );
  const template = fs.readFileSync(TemplatePaths.CoverLetterBrown);
  const buffer = await createReport({
    template,
    data: coverLetter,
    cmdDelimiter: ["++", "++"],
  });
  return buffer;
};

export const OutputPaths = {
  CoverLetter: "letters",
};

export const TemplatePaths = {
  CoverLetterBrown: "templates/cover-letter-brown.docx",
};
