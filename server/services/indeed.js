import fetch from 'node-fetch';
import fs from 'fs'

const re = /window._initialData=\{(.|\n)*window.addEventListener\('p/
const REQUEST_DELAY = 400


function getIndeedJobsIds({ jobQuery, jobLocation, page }) {
    const encodedQuery = encodeURIComponent(jobQuery)
    const encodedLocation = encodeURIComponent(jobLocation)
    const pageParam = page ? `&start=${page * 10}` : ''

    return fetch(`https://ca.indeed.com/jobs?from=searchOnHP&q=${encodedQuery}&l=${encodedLocation}${pageParam}`, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "Referer": "https://ca.indeed.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "method": "GET"
    })
        .then(res => res.text())
        .then(res => res.match(re)[0])
        .then(res => Object.keys(JSON.parse(res.substring(20, res.length - 40)).jobKeysWithTwoPaneEligibility)) //ugly but it works
}

function getIndeedJobFromId({ id }) {
    return fetch(`https://ca.indeed.com/viewjob?jk=${encodeURIComponent(id)}&spa=1`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "Referer": "https://ca.indeed.com/jobs?q=test+engineer&l=Scarborough%2C+ON&from=searchOnHP&vjk=0030a5c1d61c3f8a",
            "Referrer-Policy": "origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    })
        .then(res => {
            if (res.status != 200) {
                return Promise.reject(new Error('Too many requests'));
            }
            return res.json();
        })
}

function getIndeedJobs({ jobQuery, jobLocation, page }) {
    return getIndeedJobsIds({ jobQuery, jobLocation, page }).then((res) => (



        Promise.allSettled(
            res.map((id, ind) =>
                new Promise((res) => {
                    setTimeout(() => getIndeedJobFromId({ id }).then(out => res(out)), REQUEST_DELAY * ind)
                })
            )
        )

        // Promise.allSettled([
        //     getIndeedJobFromId({ id: res[0] }),
        //     setTimeout()
        // ])
    ))
}


const jobQuery = "Software Engineer";
const jobLocation = "Scarborough, ON";
const page = 0


getIndeedJobs({ jobQuery, jobLocation, page }).then((res) => {
    console.log(typeof res)
    fs.writeFile('final.json', JSON.stringify(res), (err) => {

        // In case of a error throw err.
        if (err) throw err;
    })
})

export { getIndeedJobs }