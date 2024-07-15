import { VertexAI } from "@google-cloud/vertexai";
import "dotenv/config";
import { Atrribute } from "../models/attributes.js";
import { Op } from "sequelize";

const PROJECT_ID = process.env.PROJECT_ID;
const REGION = process.env.GOOGLE_REGION;
const VERTEX_MODEL = process.env.VERTEX_MODEL;

async function checkSkills(attributes) {
  const prompt = `The following is a comma seperated list of attributes:

${attributes.join(",")}

Return the result in the JSON format with each key being the attribute name, and the value being a Boolean representing whether or not it is a skill.
    `;

  const vertexAI = new VertexAI({ project: PROJECT_ID, location: REGION });
  const generativeModel = vertexAI.getGenerativeModel({
    model: VERTEX_MODEL,
  });
  const resp = await generativeModel.generateContent(prompt);
  const content = resp.response;
  const result = content.candidates.at(0).content.parts.at(0).text;
  try {
    let parsedResult = JSON.parse(result.match(/\{[\s\S]+\}/)[0]);
    return Object.entries(parsedResult).map(([name, isSkill]) => ({
      name,
      isSkill,
    }));
  } catch (error) {
    return {
      error,
    };
  }
}

async function getSkills(attributes) {
  let currAttributes = await Atrribute.findAll({
    where: {
      name: {
        [Op.in]: attributes,
      },
    },
  });
  let foundAtrributeIds = currAttributes.map((att) => att.name);
  let attributesToFind = attributes.filter(
    (attribute) => !foundAtrributeIds.includes(attribute),
  );

  let newAttributes = [];
  if (attributesToFind.length > 0) {
    newAttributes = await checkSkills(attributesToFind);
    if (newAttributes.error) {
      console.log(newAttributes.error);
      newAttributes = [];
    }
  } else {
    return currAttributes.filter((att) => att.isSkill).map((att) => att.name);
  }
  let newAttributeWithId = await Atrribute.bulkCreate(newAttributes);

  return currAttributes
    .concat(newAttributeWithId)
    .filter((att) => att.isSkill)
    .map((att) => att.name);
}

export { getSkills };
