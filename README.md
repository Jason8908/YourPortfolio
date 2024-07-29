# AI Profesional Resume/Cover Letter Builder

## Project title and team name

Our team name is Wenduo Sky Chop Chop, and the project title is YourPortfolio.

## Team members with @mail.utoronto.ca emails

- miles.bernstein@mail.utoronto.ca
- jay.su@mail.utoronto.ca

## Brief description of the web application

- Users can create an account and submit their skills, interests, past experience, and previous education.

- YourPortfolio will act as a job search portal for the user, and generate catered resumes and cover letters for the specific jobs selected.

## Bullet points outlining how to fulfil "Required Elements"

- The application will use Angular

- The application's API is RESTful where appropriate

- The application will be deployed on a Virtual Machine using Docker and Docker Compose.

- We will commit all deployment files to Github, including CI files for building images.

- The web app will be deployed as a website to the general public.

- We will be using the Google Gemini API to generate resumes and cover letters.

- The Indeed Jobs page will be web-scraped in order to provide the user with relevant job posting suggestions.

- Users can log in and authentication will be done using OAuth 2.0 through Google accounts.

- The application will make use of a Postgres database hosted on Google Cloud.

## Bullet points outlining how to fulfil "Additional Requirements"

- Stripe will be integrated to the application in order to support the purchase of "credits", which will allow users to make use of the more intelligent versions of the Google Gemini AI models.

- The stripe webhook will be used to listen for successful transasctions and will update the user's credits accordingly once observed.

- Generating Resume and Cover Letters with AI is a long-running task.

## Your alpha version, beta version, and final version milestones

### Alpha Milestones

- Users are able to log in
- Users can upload skills, experience and intrests to their profile
- Users can view and search for Job Postings
- Users can generate resumes/cover letters based on the job description itself
- Website is purely functional, with minimal styles

### Beta Milestones

- Website has proper styling and looks modern
- Users can click a button next to each job posting to easily create a cover letter or resume for that job

### Final version

- Website has a landing page to explain the website
- Users can choose between multiple formats for resumes and cover letter
- Final stylistic updates are made to make the website look nice
- Website is deployed
