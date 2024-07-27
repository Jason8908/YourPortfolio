import { getSkills } from "./check-skill.js";
import "dotenv/config"
import axios from "axios";


const API_KEYS = process.env.WINTR_API_KEY.split(",")

async function getIndeedJobsIds({ jobQuery, jobLocation, page }) {
  const encodedQuery = encodeURIComponent(jobQuery);
  const encodedLocation = encodeURIComponent(jobLocation);
  const pageParam = page ? `&start=${page * 10}` : "";

  try {

    const options = {
      "method": "post",
      "responseType": "json",
      "url": "https://api.wintr.com/fetch",
      "data": {
        "apikey": API_KEYS[0],
        "method": "GET",
        "url": `https://ca.indeed.com/jobs?from=searchOnHP&q=${encodedQuery}&l=${encodedLocation}${pageParam}&spa=1`,
        "jsrender": true,
        "outputschema": {
          "jsonResponse": {
            "group": "pre",
            "data": {
              "jsonResponse": {
                "selector": "pre",
                "attr": "*text*"
              }
            }
          }
        }
      }
    }

    let res = await axios(options).catch(err => console.log(err))

    if (!res) {
      return null
    }

    let innerText = JSON.parse(res.data.content.jsonResponse[0].jsonResponse)

    return Object.keys(innerText.body.jobKeysWithTwoPaneEligibility);
  } catch (err) {
    console.log(err);
  }
}

async function getIndeedJobsv2({ ids }) {

  try {
    const jobs = await Promise.all(
      ids.map(async (id, ind) => await getIndeedJobFromIdv2({ id, ind })),
    );

    let allAttributesSet = jobs.reduce(
      (acc, curr) => acc.union(new Set(curr.attributes)),
      new Set(),
    );

    let allAttributes = [...allAttributesSet];

    let skillList = await getSkills(allAttributes);

    jobs.forEach((job) => {
      job.attributes = job.attributes.filter((attribute) =>
        skillList.includes(attribute),
      );
    });

    return jobs;
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function getIndeedJobFromIdv2({ id, ind }) {
  const apikey = API_KEYS[ind % API_KEYS.length]
  const options = {
    "method": "post",
    "responseType": "json",
    "url": "https://api.wintr.com/fetch",
    "data": {
      "apikey": apikey,
      "method": "GET",
      "url": `https://ca.indeed.com/viewjob?jk=${encodeURIComponent(id)}&spa=1`,
      "jsrender": true,
      "outputschema": {
        "jsonResponse": {
          "group": "pre",
          "data": {
            "jsonResponse": {
              "selector": "pre",
              "attr": "*text*"
            }
          }
        }
      }
    }
  }

  let res = await axios(options).catch(err => console.log(err))

  if (!res) {
    return { err: `Error (apikey=${ind})` }
  }

  let jsonResponse = JSON.parse(res.data.content.jsonResponse[0].jsonResponse)

  return parseIndeedOutput(id, jsonResponse);
}

function parseIndeedOutput(externalId, jsonResponse) {
  try {
    const jobInfo =
      jsonResponse.body.hostQueryExecutionResult.data.jobData.results[0].job;

    //const externalId = jsonResponse.body.jobKey;
    const title = jsonResponse.body.jobTitle;
    const description =
      jsonResponse.body.jobInfoWrapperModel.jobInfoModel
        .sanitizedJobDescription;
    const location = jobInfo.location.formatted.long;
    const addresss =
      jsonResponse.body.commuteInfoModel?.companyLocation ??
      jobInfo.location.streetAddress;
    const employer =
      jsonResponse.body.jobInfoWrapperModel.jobInfoModel.jobInfoHeaderModel
        .companyName;
    const benefits =
      jsonResponse.body.benefitsModel?.benefits?.map(
        (benefit) => benefit.label,
      ) ?? [];
    const jobTypes = jobInfo.jobTypes?.map((job) => job.label) ?? [];
    const link =
      jsonResponse.body.jobMetadataFooterModel.originalJobLink?.href ??
      `https://ca.indeed.com/viewjob?jk=${externalId}`;
    const attributes = jobInfo.attributes.map((a) => a.label);

    return {
      externalId,
      title,
      description,
      location,
      addresss,
      employer,
      benefits,
      jobTypes,
      link,
      attributes,
    };
  } catch (error) {
    console.log(error.toString());
    return {
      error: error.toString(),
    };
  }
}

export { getIndeedJobsIds, getIndeedJobsv2 };
