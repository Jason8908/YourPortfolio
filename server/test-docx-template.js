import {createReport} from 'docx-templates';
import fs from 'fs';

const run = async () => {
  const templatePath = 'templates/resume-basic.docx';

  const template = fs.readFileSync(templatePath);

  const buffer = await createReport({
    template,
    data: {
      fName: "Jason",
      lName: "Su",
      email: "jasonsu894@gmail.com",
      objective: "To find a job.",
      skills: [
        "Eating",
        "Sleeping",
        "Laughing"
      ],
      educations: [{
        degree: "B.S. in Computer Science",
        institution: "University of California, Irvine",
        startDate: "September 2016",
        endDate: "June 2020",
        points: [
          "Graduated with honors",
          "Dean's List"
        ]
      }],
      experiences: [
        {
          position: "Software Engineer",
          company: "Google",
          startDate: "July 2020",
          endDate: "Present",
          points: [
            "Worked on the search engine",
            "Developed new features"
          ]
        },
        {
          position: "Software Engineer",
          company: "Facebook",
          startDate: "July 2019",
          endDate: "June 2020",
          points: [
            "Worked on the social media platform",
            "Developed new features"
          ]
        },
        {
          position: "Software Engineer",
          company: "Amazon",
          startDate: "July 2018",
          endDate: "June 2019",
          points: [
            "Worked on the e-commerce platform",
            "Developed new features"
          ]
        }
      ]
    },
  });

  fs.writeFileSync('resume.docx', buffer)
}

run();