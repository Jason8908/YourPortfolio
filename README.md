# AI Proffesional Resume/Cover Letter Builder

## Project title and team name

Our team name is Wenduo Sky Chop Chop, and the project title is YourPortfolio.

## Team members with @mail.utoronto.ca emails

- miles.bernstein@mail.utoronto.ca
- jay.su@mail.utoronto.ca

## Brief description of the web application

- Users can create an account and submit their skills, intrests, experience and desired job prospects.

- YourPortfolio will find jobs with matching your portfolio, and generate catered resumes and cover letters for the specific job.

- The application will also provide job posting recommendations for the user and allow the user to upload created resumes and cover letters to Google Drive for storage.

- The user will be able to create Job Alerts with certain criteria and they will receive emails containing a batch of jobs that match their criteria.

## Bullet points outlining how to fulfil "Required Elements"

- The application will use Angular

- The application's API is RESTful where appropriate

- The application will be deployed on a Virtual Machine using Docker and Docker Compose

- We will commit all deployment files to Github, including CI files for building images.

- The web app will be deployed as a website to the general public.

- We will be using the ChatGPT API to generate resumes and cover letters.

- The Google Jobs page will be web-scraped in order to provide the user with relevant job posting suggestions.

- Users can log in and authentication will be done using OAuth 2.0 through Google accounts.

- The application will make use of a Postgres database hosted on AWS.

## Bullet points outlining how to fulfil "Additional Requirements"

- Because users will be signed in using their Google accounts, a feature will be available to upload created cover letters and resumes to their Google Drive.

- The SendGrid webhook will be used to send emails to users periodically once there are job postings that match the filters in their created job alerts.

- Generating Resume and Cover Letters with AI is a long-running task.

## Your alpha version, beta version, and final version milestones

### Alpha Milestones

- Users are able to log in
- Users can upload skills, experience and intrests to their profile
- Users can view Elligible Job Postings based on their Profile
- Users can generate resumes/cover letters based on the job description itself
- Website is purely functional, with minimal styles

### Beta Milestones

- Website has proper styling and looks modern
- Website is reponsive to mobile devices
- Users can click a button next to each job posting to easily create a cover letter or resume for that job
- Resumes and Cover Letters are uploaded to Google Drive after creation
- Users can create job alerts that will send periodic emails to them with relevant jobs

### Final version

- Website has a landing page to explain the website
- Users can choose between multiple generated resumes/cover letters
- Users can choose between multiple formats for resumes and cover letter
- Final stylistic updates are made to make the website look nice
- Website is deployed
