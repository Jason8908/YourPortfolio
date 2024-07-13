import fetch from "node-fetch";
import fs from "fs";
import puppeteer from "puppeteer";
import { getSkills } from "./check-skill.js";

const REQUEST_DELAY = 600;

async function getIndeedJobsIds({ jobQuery, jobLocation, page }) {

    const encodedQuery = encodeURIComponent(jobQuery);
    const encodedLocation = encodeURIComponent(jobLocation);
    const pageParam = page ? `&start=${page * 10}` : "";

    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: {
            width: 1280,
            height: 800,
        },
    });

    try {

        const browserPage = await browser.newPage();
        await browserPage.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        );

        await browserPage.goto(
            `https://ca.indeed.com/jobs?from=searchOnHP&q=${encodedQuery}&l=${encodedLocation}${pageParam}&spa=1`,
        );
        await browserPage.waitForSelector("pre", { timeout: 2_000 });

        const innerText = await browserPage.evaluate(() => {
            return JSON.parse(document.querySelector("body").innerText);
        });
        await browser.close();

        return Object.keys(innerText.body.jobKeysWithTwoPaneEligibility);
    } catch (err) {
        await browser.close();
        console.log(err)
    }
}

async function getIndeedJobsv2({ ids }) {

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: {
            width: 1280,
            height: 800,
        },
    });

    try {
        const jobs = await Promise.all(ids.map(async id => await getIndeedJobFromIdv2({ browser, id })))
        await browser.close()
        let allAttributesSet = jobs.reduce(
            (acc, curr) => acc.union(new Set(curr.attributes)),
            new Set()
        )

        let allAttributes = [...allAttributesSet]

        let skillList = await getSkills(allAttributes)

        jobs.forEach(job => {
            job.attributes = job.attributes.filter(attribute => skillList.includes(attribute))
        })

        return jobs
    }

    catch (e) {
        console.log(e)
        return []
    }

}

async function getIndeedJobFromIdv2({ browser, id }) {
    const browserPage = await browser.newPage();
    await browserPage.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    );

    await browserPage.goto(`https://ca.indeed.com/viewjob?jk=${encodeURIComponent(id)}&spa=1`);
    await browserPage.waitForSelector("pre", { timeout: 2_000 });

    let jsonResponse = await browserPage.evaluate(() => {
        return JSON.parse(document.querySelector("body").innerText);
    });

    return parseIndeedOutput(id, jsonResponse)
}

function parseIndeedOutput(externalId, jsonResponse) {
    try {
        const jobInfo =
            jsonResponse.body.hostQueryExecutionResult.data.jobData.results[0].job;

        //const externalId = jsonResponse.body.jobKey;
        const title = jsonResponse.body.jobTitle;
        const description = jsonResponse.body.jobInfoWrapperModel.jobInfoModel.sanitizedJobDescription
        const location = jobInfo.location.formatted.long;
        const addresss = jsonResponse.body.commuteInfoModel?.companyLocation ?? jobInfo.location.streetAddress
        const employer = jsonResponse.body.jobInfoWrapperModel.jobInfoModel.jobInfoHeaderModel.companyName;
        const benefits = jsonResponse.body.benefitsModel?.benefits?.map(benefit => benefit.label) ?? [];
        const jobTypes = jobInfo.jobTypes?.map(job => job.label) ?? [];
        const link = jsonResponse.body.jobMetadataFooterModel.originalJobLink?.href ?? `https://ca.indeed.com/viewjob?jk=${externalId}`;
        const attributes = jobInfo.attributes.map(a => a.label);

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
        console.log(error.toString())
        return {
            error: error.toString(),
        };
    }
}

// const jobQuery = "Software Engineer";
// const jobLocation = "Scarborough, ON";
// const page = 0

// console.log(await getIndeedJobsIds({ jobQuery, jobLocation, page }))

// getIndeedJobs({ jobQuery, jobLocation, page }).then((res) => {
//     console.log(typeof res)
//     fs.writeFile('final.json', JSON.stringify(res), (err) => {

//         // In case of a error throw err.
//         if (err) throw err;
//     })
// })

// const ids = ["922e764e164715d3", "922e764e164715d3", "922e764e164715d3", "922e764e164715d3"]

// let res = await getIndeedJobsv2({ ids });
// ((res) => {
//     // console.log(typeof res)
//     fs.writeFile('final.json', JSON.stringify(res), (err) => {

//         // In case of a error throw err.
//         if (err) throw err;
//     })
// })(res)

// const browser = await puppeteer.launch({
//     headless: false,
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     defaultViewport: {
//         width: 1280,
//         height: 800,
//     },
// });

// const browserPage = await browser.newPage();
// await browserPage.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
// );
// await browserPage.goto(`https://ca.indeed.com/viewjob?jk=${encodeURIComponent(ids[0])}&spa=1`);
// await browserPage.waitForSelector("pre", { timeout: 2_000 });

// let test = await browserPage.evaluate(() => {
//     return JSON.parse(document.querySelector("body").innerText);
// });

// console.log(test)


export { getIndeedJobsIds, getIndeedJobsv2 };
