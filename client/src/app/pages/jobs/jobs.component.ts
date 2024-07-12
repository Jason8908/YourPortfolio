import { Component, inject } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { JobPreviewComponent } from '../../components/job-preview/job-preview.component';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { JobDescriptionComponent } from '../../components/job-description/job-description.component';
import { JobSearchComponent } from '../../components/job-search/job-search.component';
import { JobSearchRequest } from '../../classes/jobSearch';
import { SpinnerDialogComponent } from '../../components/spinner-dialog/spinner-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    AuthHeaderComponent,
    JobPreviewComponent,
    CommonModule,
    JobDescriptionComponent,
    JobSearchComponent,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css',
})
export class JobsComponent {
  jobSearchResult: any[] = [];
  currentJob: any = undefined;
  spinnerRef: any = null;
  readonly dialog = inject(MatDialog);
  public currentQuery: any;
  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentQuery = {};
  }

  showSpinner() {
    if (this.spinnerRef) return;
    this.spinnerRef = this.dialog.open(SpinnerDialogComponent, {
      height: '150px',
      width: '150px',
    });
  }

  hideSpinner() {
    if (!this.spinnerRef) return;
    this.spinnerRef.close();
    this.spinnerRef = null;
  }

  setItem(newId: number) {
    this.currentJob = this.jobSearchResult.find((job) => job.id == newId);
  }

  onSearch(search: JobSearchRequest) {
    this.showSpinner();
    this.apiService.getJobs(search).subscribe({
      next: (res) => {
        this.jobSearchResult = res.data;
        this.currentJob = res.data[0];
        this.hideSpinner();
      },
      error: (err) => {
        this.hideSpinner();
        this.snackBar.open(err.toString(), 'OK');
      },
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (!params['query'] || !params['location']) {
        this.router.navigate(['dashboard']);
      } else {
        this.currentQuery = {
          query: params['query'],
          location: params['location'],
        };
        this.onSearch(this.currentQuery);
      }
    });

    this.jobSearchResult = {
      data: [
        {
          benefits: [
            'Casual dress',
            'Dental care',
            'Disability insurance',
            'Extended health care',
            'Flexible schedule',
            'Life insurance',
            'On-site gym',
            'On-site parking',
            'Paid time off',
            'RRSP match',
            'Work from home',
          ],
          jobTypes: ['Permanent', 'Full-time'],
          attributes: [
            'Casual dress',
            'Extended health care',
            'RRSP match',
            '8 hour shift',
            'Data modeling',
            'Permanent',
            'Relational databases',
            'Mobile applications',
            'Full-time',
            'Disability insurance',
            'Java',
            'On-site gym',
            'Dental care',
            'Analysis skills',
            'Paid time off',
            'JavaScript',
            'REST',
            'Work from home',
            'French not required',
            'Angular',
            'Hybrid work',
            'Day shift',
            'APIs',
            'Web services',
            'Linux',
            'Monday to Friday',
            'In-person',
            'On call',
            'TypeScript',
            'Communication skills',
            'Flexible schedule',
            'Life insurance',
            'HTML5',
            'MySQL',
            'On-site parking',
          ],
          id: 65,
          externalId: '6ecb4ed252fad423',
          title: 'Senior Web Developer',
          description:
            '<p><b>About us</b></p>\n<p>Pala Interactive Canada is a leading online real money &amp; social gaming B2B platform servicing regulated markets.</p>\n<p>Our solution creates a single sign-on, single wallet player experience across social casino, mobile on premise, and real money gaming.</p>\n<p><b>THE POSITION</b></p>\n<p>The Senior Web Developer will have primary responsibility for designing and implementing mobile gaming applications on an open source Linux platform using HTML5, Angular, ionic integrating with restful APIs, Java framework and other open source tools. The mobile gaming applications are highly configurable and customizable, are under a high transaction rate with high robustness and scalability requirements.</p>\n<p>Major technical duties include:</p>\n<ul>\n <li>Design and implement code in HTML5, Angular, ionic, JavaScript, TypeScript to support a high transaction rate and mission critical mobile gaming applications with efficiency, robustness and high performance;</li>\n <li>Design and implement account management modules, database interaction, APIs, financial transactions, back office applications and various administration applications.</li>\n <li>Manage and implement changes specified by the design team to an array of different websites.</li>\n</ul>\n<p><b>Requirements:</b></p>\n<ul>\n <li>At least 5 years of relevant development experience</li>\n <li>Comfortable with design, implementation and partitioning or delegation of large, complex features</li>\n <li>Experience with developing Mobile Gaming and/or Mobile Applications in a high transaction, high security environment</li>\n <li>Demonstrates strong HTML5, Canvas skills</li>\n <li>Skilled JavaScript developer with Angular and ionic experience</li>\n <li>Good knowledge of MySQL and web services integration</li>\n <li>Experience with Facebook API’s</li>\n <li>Experience with logical data modeling and physical relational database design</li>\n <li>Understands highly efficient, highly robust, transactional scalable systems</li>\n <li>Understands redundancy, scalability, fail-over mechanism</li>\n <li>Understanding of communications transaction processing systems</li>\n <li>Understanding of internet, electronic commerce and web-related technologies</li>\n <li>Formal software education</li>\n <li>Ability to adapt to new environments, and the ability to identify, propose and implement changes and improvements</li>\n <li>Solid analytical and problem solving skills</li>\n <li>Strong interpersonal and communication skills, both written and verbal</li>\n</ul>\n<p>Job Types: Full-time, Permanent</p>\n<p>Benefits:</p>\n<ul>\n <li>Casual dress</li>\n <li>Dental care</li>\n <li>Disability insurance</li>\n <li>Extended health care</li>\n <li>Flexible schedule</li>\n <li>Life insurance</li>\n <li>On-site gym</li>\n <li>On-site parking</li>\n <li>Paid time off</li>\n <li>Vision care</li>\n <li>Work from home</li>\n</ul>\n<p>Flexible Language Requirement:</p>\n<ul>\n <li>French not required</li>\n</ul>\n<p>Schedule:</p>\n<ul>\n <li>8 hour shift</li>\n <li>Day shift</li>\n <li>Monday to Friday</li>\n</ul>\n<p>Ability to commute/relocate:</p>\n<ul>\n <li>North York, ON: reliably commute or plan to relocate before starting work (required)</li>\n</ul>\n<p>Work Location: Hybrid remote in North York, ON</p>\n<p>Job Types: Full-time, Permanent</p>\n<p>Benefits:</p>\n<ul>\n <li>Dental care</li>\n <li>On-site parking</li>\n <li>RRSP match</li>\n</ul>\n<p>Schedule:</p>\n<ul>\n <li>Monday to Friday</li>\n <li>On call</li>\n</ul>\n<p>Ability to commute/relocate:</p>\n<ul>\n <li>North York, ON M2J 5B5: reliably commute or plan to relocate before starting work (required)</li>\n</ul>\n<p>Application question(s):</p>\n<ul>\n <li>Do you have at least 7 years of Frontend development experience?</li>\n</ul>\n<p>Work Location: In person</p>\n<p>Application deadline: 2023-06-16<br>Expected start date: 2024-06-24</p>',
          location: 'North York, ON',
          address: null,
          employer: 'Pala Interactive Canada',
          link: 'https://ca.indeed.com/viewjob?jk=6ecb4ed252fad423',
          createdAt: '2024-07-02T04:57:06.540Z',
          updatedAt: '2024-07-02T04:57:06.540Z',
        },
        {
          jobTypes: ['Full-time'],
          attributes: [
            'Computer science',
            'CSS',
            'Full-time',
            'OOP',
            'Analysis skills',
            'JavaScript',
            'Angular',
            'UX',
            'Software development',
            'Agile',
            'HTML5',
          ],
          id: 141,
          externalId: 'f0b39a3616a9661a',
          title: 'Front-End Engineer, AMC',
          description:
            '<ul> \n <li>2+ years of non-internship professional front end, web or mobile software development using JavaScript, HTML and CSS experience</li> \n <li>1+ years of computer science fundamentals (object-oriented design, data structures, algorithm design, problem solving and complexity analysis) experience</li> \n <li>Experience using JavaScript frameworks such as angular and react</li> \n</ul> Do you want to work in a start-up environment with the resources of Amazon behind you? We’re building a new team in Toronto to help build out Amazon Marketing Cloud (AMC). AMC is a secure, privacy-safe, and cloud-based environment in which advertisers can easily perform analytics across multiple data sets to generate insights to take programmatic actions. Our services ingest billions of behavioral signals every day. Speed, scale, and accuracy are critical to our success. \n<br>\n<br> We work in some of the most exciting computer science domains. We are managing massive scale streaming systems, applying machine learning and data science to drive optimizations and insights while building a scalable front-end infrastructure. We help internal and external advertisers to deeply understand their customers and markets. \n<br>\n<br> We’re looking for experienced, motivated front end engineers with a proven track record of developing complex front end products. The ideal candidate will be innovative, have great problem solving, analytical and technical skills. You have a deep understanding of software development in an agile team environment. You demonstrate exceptional customer relationships skills and love to discover the true requirements underlying feature requests. You enjoy simplifying complex problems and tackling tough challenges. \n<br>\n<br> \n<ul> \n <li>3+ years of non-internship professional front end, web or mobile software development using JavaScript, HTML and CSS experience</li> \n <li>Experience building reusable UX components or libraries</li> \n <li>Experience building scalable, distributed, front-end experiences</li> \n <li>Experience in agile software development methodology</li> \n</ul> Amazon is committed to a diverse and inclusive workplace. Amazon is an equal opportunity employer and does not discriminate on the basis of race, national origin, gender, gender identity, sexual orientation, disability, age, or other legally protected status. If you would like to request an accommodation, please notify your Recruiter.',
          location: 'Toronto, ON',
          address: null,
          employer: 'Amazon Development Centre Canada ULC',
          link: 'https://ca.indeed.com/applystart?jk=f0b39a3616a9661a&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKkqPk5Nc9JteJjBFS4dOFhBvIeGUCb5peqr32NKkGBLiS0i9wYrA3t-7-KM3bbVd_qoEEadtPMTcDNEwTGERtt4x0Ous10a0hlH1_YsLnFAT4dEkEv5BAe-Lb8UOkJopvULMDJcyntLyTJTVTexHi5Ow9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=6ee9e810a6cceb19&assa=6897',
          createdAt: '2024-07-03T00:25:05.691Z',
          updatedAt: '2024-07-03T00:25:05.691Z',
        },
        {
          benefits: ['Extended health care'],
          jobTypes: ['Full-time'],
          attributes: [
            'AJAX',
            'Elasticsearch',
            'Extended health care',
            'Oracle',
            'CSS',
            'Relational databases',
            'Engineering',
            'Full-time',
            'NoSQL',
            'No experience needed',
            'MongoDB',
            'Java',
            'SOAP',
            'JavaScript',
            'REST',
            'Computer Engineering',
            'Angular',
            'UX',
            'Hybrid work',
            'APIs',
            'Design thinking',
            'JDBC',
            'Service-oriented architecture',
            'Informatica',
            'PL/SQL',
            'TypeScript',
            'HTML5',
            'Hibernate',
          ],
          id: 176,
          externalId: '9f6ba673b01f4b63',
          title: 'Software Developer Specialist',
          description:
            "<div>\n <p>Who needs insurance? Everybody. That keeps us busy. Very busy. At the Intact Lab, we use machine learning, data science, software engineering, AI, agility, UX and design thinking to transform the customer experience for millions of Canadians.</p>\n <p></p>\n <p> Join our team and get ready to explore, take risks, make mistakes, and learn all day, every day. We’ll support your goals with tools, opportunities, and flexibility. It’s our employee promise.</p>\n <p></p>\n <p> Our hybrid work model provides the balance between working from home and enjoying meaningful in-person interactions.</p>\n <p></p>\n <p> Ready to make your mark?</p>\n <p></p>\n <p><b> About the role</b></p>\n <p></p>\n <p> We’re looking for a Software Development Specialist to join our growing team!<br> <br> <b>What you'll do here:</b></p>\n <ul>\n  <li> Improve and develop software systems to meet users' needs by finding solutions, solving complex problems, coding, testing, debugging and documenting systems.</li>\n  <li> Take part in Production Support activities, troubleshooting production issues, performance bottlenecks and identifying fixes for the same.</li>\n  <li> Guide, mentor and coache the team members in various development and technical activities.</li>\n  <li> Lead (Analysis/design/realization) an initiative involving a development team.</li>\n  <li> Take part in all project phases to ensure completion by collaborating with users and communicating status reports.</li>\n  <li> Provide deployment support for production systems to guarantee their functionality.</li>\n  <li> Ensure systems are optimal and meet quality standards by analyzing, providing suggestions and developing assessments.</li>\n  <li> Make recommendations and participate in improving development and system maintenance processes.</li>\n  <li> Apply the SDLC (System Development Life Cycle) development methodology to ensure standards are met.</li>\n  <li> Design, develop and maintain Informatica cloud assets using the appropriate data load techniques.</li>\n  <li> Debug and tune Data Integration, Application Integration and Mass Ingestion assets.</li>\n  <li> Analyze data warehouse architecture, troubleshoot and recommend improvements and alternate methodologies.</li>\n  <li> Participate in code reviews and ensure that all solutions are aligned to pre-defined architectural and requirement specifications.</li>\n  <li> May prepare or review product documentation, written instructions or technical literature for accuracy and completeness.</li>\n  <li> Maintain business rules associated with data integration.</li>\n </ul>\n <p></p>\n <p><b> What you bring to the table:</b></p>\n <ul>\n  <li> Degree in Computer Engineering / Science or any combination of equivalent education and experience.</li>\n  <li> 8-10 years of software design and development experience.</li>\n  <li> Minimum of 3-5 years' experience working with Informatica Intelligent Cloud Services (IICS) – Primarily Cloud Application Integration.</li>\n  <li> Experience on Cloud Data Integration would be an added advantage.</li>\n  <li> Knowledge of Service Oriented Architecture, Mesh App and Service Architecture.</li>\n  <li> Great level of Object-Oriented Analysis and Design experience, and a good understanding of the UX design principles.</li>\n  <li> Minimum of 2-3 years of JavaScript, TypeScript, Angular 2+, HTML, CSS and AJAX experience is preferred.</li>\n  <li> Minimum of 3-5 years of experience building server-side apps using Java 8+, JDBC, Hibernate and creating web services or APIs using REST (and SOAP).</li>\n  <li> 2+ years of experience with relational databases such as Oracle 12+, PL/SQL and NoSQL databases such as MongoDB or Elasticsearch.</li>\n  <li> No Canadian work experience required however must be eligible to work in Canada.</li>\n </ul>\n <p></p>\n <p> #LI-Hybrid</p>\n <p></p>\n <p><b> What we offer</b></p>\n <p></p>\n <p> Working here means you'll be empowered to be and do your best every day. Here is some of what you can expect as a permanent member of our team: </p>\n <ul>\n  <li><p>A financial rewards program that recognizes your success </p></li>\n  <li><p>An industry leading Employee Share Purchase Plan; we match 50% of net shares purchased </p></li>\n  <li><p>An extensive flex pension and benefits package, with access to virtual healthcare </p></li>\n  <li><p>Flexible work arrangements </p></li>\n  <li><p>Possibility to purchase up to 5 extra days off per year </p></li>\n  <li><p>An annual wellness account that promotes an active and healthy lifestyle </p></li>\n  <li><p>Access to tools and resources to support physical and mental health, embracing change and connecting with colleagues </p></li>\n  <li><p>A dynamic workplace learning ecosystem complete with learning journeys, interactive online content, and inspiring programs </p></li>\n  <li><p>Inclusive employee-led networks to educate, inspire, amplify voices, build relationships and provide development opportunities</p></li>\n  <li><p> Inspiring leaders and colleagues who will lift you up and help you grow </p></li>\n  <li><p>A Community Impact program, because what you care about is a part of what makes you different. And how you contribute to your community should be just as unique </p></li>\n </ul>\n <p></p>\n <p><b>We are an equal opportunity employer</b></p>\n <p></p>\n <p> At Intact, we value diversity and strive to create an inclusive, accessible workplace where all individuals feel valued, respected, and heard. </p>\n <p></p>\n <p>If we can provide a specific adjustment to make the recruitment process more accessible for you, please let us know when we reach out about a job opportunity. We’ll work with you to meet your needs. </p>\n <p></p>\n <p>Click here to review other important information about the hiring process, including background checks, internal candidates, and eligibility to work in Canada.<br> </p>\n <p><b>If you are an employee of Intact or belairdirect, please apply for this role on Contact People.</b></p>\n</div>",
          location: 'Toronto, ON',
          address: null,
          employer: 'Intact',
          link: 'https://ca.indeed.com/applystart?jk=9f6ba673b01f4b63&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKnwlS9DtXPNg9ihy-Ho9akNlxGBuDWXvj5ASusS0reijHxyIKbCJj3Hyl_wcggz56LV8x6R0onbMsRCTtH8rE3qDen-Rebj7lsWTNF8mj3V-CENxsCYA_eFRuIIIKupgnvNs8Y7cLSdGR-G7tD5TFJOw9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=c41eb057b19d4e91&assa=722',
          createdAt: '2024-07-10T04:26:20.951Z',
          updatedAt: '2024-07-10T04:26:20.951Z',
        },
        {
          benefits: [],
          jobTypes: ['Full-time'],
          attributes: [
            'Microsoft Excel',
            'Computer Science',
            'Relational databases',
            'Full-time',
            'AWS',
            "Bachelor's",
            'PostgreSQL',
            'Distributed systems',
            'Software development',
            'SDLC',
            'Design patterns',
          ],
          id: 179,
          externalId: '7e28b3211aa8db45',
          title: 'Senior Software Developer, RDS Aurora PostgreSQL',
          description:
            '<div>\n Are you interested in building hyper-scale database services in the cloud? Do you want to revolutionize the way databases are built for the cloud ? Do you want to have direct and immediate impact on hundreds of thousands of users who use AWS database services?\n <br> \n <br> Amazon Aurora is an exciting area of innovation for AWS, and the PostgreSQL-compatible edition of Amazon Aurora is built on one of the most active code bases in the open source community. The Postgres-compatible version of Amazon Aurora is a relational database which offers enterprise-class performance, availability and durability to our customers, along with the management benefits of RDS. We are one of the fastest growing businesses within Amazon Web Services. We are currently spread across Seattle, Toronto and Bangalore.\n <br> \n <br> If you’re a developer who is looking to grow, come on board! We have one of the most senior teams in AWS - and our senior developers are eager to brainstorm, mentor, and get software built together. We build software, we patent new things, and we attend conferences around the world to learn even more. We have challenging problems to solve in distributed systems, concurrency, database internals, caching, query optimization and languages.\n <br> \n <br> Amazon Aurora PostgreSQL Engine team is looking for experienced technical experts in relational databases and large scale storage system technologies, who are excited about building large scale database systems that run across thousands of servers across multiple data-centers worldwide. These are core systems development positions where you will own the design and development of significant system software components critical to our industry leading database services architected for the cloud. You will be part of the team that architects, designs, and implements highly scalable distributed database systems that provide availability, reliability and performance guarantees. This is a hands on position where you will be asked to do everything from building rock-solid components to mentoring other developers. You need to not only be a top software developer and systems designer with a good track record of delivering and also excel in communication, leadership and customer focus. A successful candidate will bring deep technical and software expertise and ability to deliver a service that has a broad business impact.\n <br> \n <br> We intend to be the world\'s best and fastest database, built by an excellent team, all while having fun - come join us on the journey! For more information about Aurora, please visit http://aws.amazon.com/rds/aurora.\n <br> \n <br> We are open to hiring candidates to work out of one of the following locations:\n <br> \n <br> Toronto, ON, CAN\n <br> \n <h3 class="jobSectionHeader"><b> BASIC QUALIFICATIONS</b></h3>\n <ul>\n  <li>5+ years of non-internship professional software development experience</li>\n  <li>5+ years of programming with at least one software programming language experience</li>\n  <li>5+ years of leading design or architecture (design patterns, reliability and scaling) of new and existing systems experience</li>\n  <li>Experience as a mentor, tech lead or leading an engineering team</li>\n </ul>\n <h3 class="jobSectionHeader"><b> PREFERRED QUALIFICATIONS</b></h3>\n <ul>\n  <li>5+ years of full software development life cycle, including coding standards, code reviews, source control management, build processes, testing, and operations experience</li>\n  <li>Bachelor\'s degree in computer science or equivalent</li>\n </ul>\n <br> Amazon is committed to a diverse and inclusive workplace. Amazon is an equal opportunity employer and does not discriminate on the basis of race, national origin, gender, gender identity, sexual orientation, disability, age, or other legally protected status. If you would like to request an accommodation, please notify your Recruiter.\n</div>',
          location: 'Toronto, ON',
          address: null,
          employer: 'Amazon Development Centre Canada ULC',
          link: 'https://ca.indeed.com/applystart?jk=7e28b3211aa8db45&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKlAorw8zBZZ_ss72xtdT1oBxNHHohmu5asTeC_gmWdRW_lqdJKt-m_jYSENE8nhTpOJHaUtmIMX9G_rtIlIx2Q6VLPq9Qb915nRt6JHgVwD3CRQCM_5fzxnsjANeXxu3DXW7KLwO6XJQhzQ1XreGSKSw9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=f0cbb6c5421ff368&assa=1151',
          createdAt: '2024-07-10T04:27:41.179Z',
          updatedAt: '2024-07-10T04:27:41.179Z',
        },
        {
          benefits: ['Life insurance', 'Tuition reimbursement'],
          jobTypes: ['Full-time'],
          attributes: [
            'Commission pay',
            'Data structures',
            'Post-secondary education',
            'Full-time',
            'Test-driven development',
            'Analysis skills',
            'Tuition reimbursement',
            'Release management',
            'Integration testing',
            'Business requirements',
            'Business',
            'Communication skills',
            'Life insurance',
          ],
          id: 182,
          externalId: 'de22e73b33f318ca',
          title: 'Software Developer (New or Recent Graduate)',
          description:
            '100 King Street West Toronto Ontario,M5X 1A1 \n<br> \n<div>\n <p>Drives the overall software development lifecycle including working across functional teams to transform requirements into features, managing development teams and processes, and conducting software testing and maintenance. Specific project areas of focus includes translating user requirements into technical specifications, writing code and managing the preparation of design specifications. Supports system design, provides advice on security requirements and debugs business systems and service applications. Applies deep knowledge of algorithms, data structures and programming languages to develop high quality technology applications and services - including tools, standards, and relevant software platforms based on business requirements.</p>\n <ul>\n  <li> Translates user needs into technical specifications by understanding, conceptualizing, and facilitating technical requirements from user. </li>\n  <li>Analyzes, develops, tests, and implements new software programs, and documentation of entire software development life cycle execution.</li>\n  <li> Performs preventative and corrective maintenance, troubleshooting and fault rectification of system and core software components.</li>\n  <li> Ensures that code/configurations adhere to the security, logging, error handling, and performance standards and non-functional requirements. </li>\n  <li>Evaluates new technologies for fit with the program/system/eco-system and the associated upstream and downstream impacts on process, data, and risk.</li>\n  <li> Follows release management processes and standards, and applies version controls. </li>\n  <li>Assists in interpreting and documentation of client requirements. </li>\n  <li>Focus is primarily on business/group within BMO; may have broader, enterprise-wide focus.</li>\n  <li> Exercises judgment to identify, diagnose, and solve problems within given rules.</li>\n  <li> Works independently on a range of complex tasks, which may include unique situations.</li>\n  <li> Broader work or accountabilities may be assigned as needed.</li>\n </ul>\n <p></p>\n <p><b> Qualifications:</b></p>\n <p> Foundational level of proficiency:</p>\n <ul>\n  <li> Creative thinking.</li>\n  <li> Building and managing relationships.</li>\n  <li> Emotional agility.</li>\n  <li> Quality Assurance and Testing.</li>\n  <li> Cloud computing.</li>\n  <li> Microservices.</li>\n  <li> Technology Business Requirements Definition, Analysis and Mapping.</li>\n  <li> Adaptability.</li>\n  <li> Learning Agility.</li>\n </ul>\n <p> Intermediate level of proficiency:</p>\n <ul>\n  <li> Programming.</li>\n  <li> Applications Integration.</li>\n  <li> Test Driven Development.</li>\n  <li> System Development Lifecycle.</li>\n  <li> Troubleshooting.</li>\n  <li> System and Technology Integration.</li>\n  <li> Verbal &amp; written communication skills.</li>\n  <li> Collaboration &amp; team skills.</li>\n  <li> Analytical and problem solving skills.</li>\n  <li> Data driven decision making.</li>\n  <li> Typically between 4 - 6 years of relevant experience and post-secondary degree in related field of study or an equivalent combination of education and experience.</li>\n  <li> Technical proficiency gained through education and/or business experience.</li>\n </ul> \n <p><b>Salary:</b></p>\n <p> $60,000.00 - $111,700.00</p>\n <p><b> Pay Type:</b></p>\n <p> Salaried</p>\n <p> The above represents BMO Financial Group’s pay range and type.</p>\n <p> Salaries will vary based on factors such as location, skills, experience, education, and qualifications for the role, and may include a commission structure. Salaries for part-time roles will be pro-rated based on number of hours regularly worked. For commission roles, the salary listed above represents BMO Financial Group’s expected target for the first year in this position.</p>\n <p> BMO Financial Group’s total compensation package will vary based on the pay type of the position and may include performance-based incentives, discretionary bonuses, as well as other perks and rewards. BMO also offers health insurance, tuition reimbursement, accident and life insurance, and retirement savings plans. To view more details of our benefits, please visit: https://jobs.bmo.com/global/en/Total-Rewards</p> \n <p><b>We’re here to help</b></p>\n <p> At BMO we are driven by a shared Purpose: Boldly Grow the Good in business and life. It calls on us to create lasting, positive change for our customers, our communities and our people. By working together, innovating and pushing boundaries, we transform lives and businesses, and power economic growth around the world.</p>\n <p> As a member of the BMO team you are valued, respected and heard, and you have more ways to grow and make an impact. We strive to help you make an impact from day one – for yourself and our customers. We’ll support you with the tools and resources you need to reach new milestones, as you help our customers reach theirs. From in-depth training and coaching, to manager support and network-building opportunities, we’ll help you gain valuable experience, and broaden your skillset.</p>\n <p> To find out more visit us at https://jobs.bmo.com/ca/en </p>\n <p>BMO is committed to an inclusive, equitable and accessible workplace. By learning from each other’s differences, we gain strength through our people and our perspectives. Accommodations are available on request for candidates taking part in all aspects of the selection process. To request accommodation, please contact your recruiter.</p>\n <p> Note to Recruiters: BMO does not accept unsolicited resumes from any source other than directly from a candidate. Any unsolicited resumes sent to BMO, directly or indirectly, will be considered BMO property. BMO will not pay a fee for any placement resulting from the receipt of an unsolicited resume. A recruiting agency must first have a valid, written and fully executed agency agreement contract for service to submit resumes.</p>\n</div>',
          location: 'Toronto, ON',
          address: null,
          employer: 'BMO Financial Group',
          link: 'https://ca.indeed.com/applystart?jk=de22e73b33f318ca&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKkMClQc4fMNns3KI3RS7RkpAUAaRLUcUszHNQDI46MB5NbGjuZdJym8Z-eVvTuVSTqII5ye6jpC5xH1xFAUZZx-wyDe3YUz63FMOuDdDwZr13sKgp3-oOWzsnzeeQdzpztuH6XN1dGbVe1TZ3gJ79Waw9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=1523f1c320ac9d1e&assa=5755',
          createdAt: '2024-07-10T21:59:24.800Z',
          updatedAt: '2024-07-10T21:59:24.800Z',
        },
        {
          benefits: [],
          jobTypes: ['Full-time'],
          attributes: [
            'Statistics',
            'Doctoral degree',
            'Computer Science',
            'XML',
            'Full-time',
            "Master's degree",
            'Statistical analysis',
            'Project management',
            "Bachelor's",
            'In-person',
          ],
          id: 188,
          externalId: 'e3e60fb0b0ec62e0',
          title: 'Senior Statistical Programmer',
          description:
            '<p></p>\n<div>\n <p>Everest Clinical Research (“Everest”) is a full-service contract research organization (CRO) providing a broad range of expertise-based clinical research services to worldwide pharmaceutical, biotechnology, and medical device industries. We serve some of the best-known companies and work with many of the most advanced drugs, biologics, and medical devices in development today.</p> \n <p> Everest has been an independent CRO since 2004 with a strong foundation as a statistical and data management center of excellence. Building on this foundation, Everest has successfully developed and established itself as a full-service CRO. Everest’s headquarters are located in Markham (Greater Toronto Area), Ontario, Canada with additional sites in Bridgewater (Greater New York City Area), New Jersey, USA, Shanghai (Pudong Zhangjiang New District), China and Taipei, Taiwan.</p> \n <p> Everest is known in the industry for its high quality deliverables, superior customer service, and flexibility in meeting clients’ needs. A dynamic organization with an entrepreneurial origin, Everest continues to experience exceptional growth and great success.</p> \n <p> Quality is our backbone, customer-focus is our tradition, flexibility is our strength…that’s us…that’s Everest.</p> \n <p> To drive continued success in this exciting clinical research field, we are seeking committed, skilled, and customer-focused individuals to join our winning team as <b>Senior Statistical Programmers</b> for our Toronto/Markham, Ontario, Canada on-site location, or remotely from a home-based office anywhere in Canada in accordance with our Work from Home policy.</p> \n <p><b> Key Accountabilities:</b></p> \n <p> Lead efforts in resolving day-to-day work-related issues and problems, ensuring quality of deliverables, as well as improving the efficiency and productivity of statistical programming work.</p> \n <p> Lead assigned projects by applying project management skills and statistical programming techniques; achieve on-time delivery of deliverables with quality, as well as earn client’s trust and repeat business.</p> \n <p> Develop SDTM and ADaM dataset specifications for CSRs, ISS, and ISE following company’s or client’s Standard Operating Procedures (SOPs) and project specific requirements. Perform quality control (QC) review of these documents prepared by others.</p> \n <p> Program and validate SDTM and ADaM datasets following approved dataset specifications for CSRs, ISS, and ISE.</p> \n <p> Perform CDISC standard compliant checks on SDTM and ADaM datasets. Generate, review, and resolve Pinnacle 21 validation issues. Perform additional QC checks on these deliverables using company Working Instruction (WI) QC checklists.</p> \n <p> Perform overall quality/consistency review of statistical TLGs before delivering them to the internal team or the client.</p> \n <p> Create SDTM and ADaM define.xml files. Perform QC review of these files prepared by others.</p> \n <p> Participate and/or lead programming teams in support of product regulatory submission related activities.</p> \n <p> Learn and maintain expertise in the use of the utilities and macros developed for the Statistical Programmers. Develop new macros and utilities.</p> \n <p> Program and perform QC/validation of complex data integrity checks to ensure data quality and ongoing scientific data surveillance.</p> \n <p>Complete job-required and project-specific training. Comply with applicable Everest and trial Sponsor’s Policies, SOPs, and WIs.</p> \n <p> Document data and programming information in accordance with corporate SOPs and guidelines.</p> \n <p> Archive clinical trial data (SDTM and ADaM datasets) and programming information in accordance with corporate archival SOPs and guidelines.</p> \n <p><b> Qualifications:</b></p> \n <p> A Master’s or Ph.D. degree in Statistics, Biostatistics, Epidemiology, and Computer Sciences, with at least four years’ experience in clinical trial statistical programming</p> \n <p> OR</p> \n <p> A Bachelor’s degree in the above fields with at least six years’ experience in clinical trial statistical programming.</p>\n <br> \n <p></p> \n <p> To find out more about Everest Clinical Research and to review other opportunities, please visit our website at www.ecrscorp.com.</p> \n <p> We thank all interested applicants, however, only those selected for an interview will be contacted.</p> \n <p> Everest is committed to upholding the principles of dignity, independence, integration, and equal opportunity. We welcome and encourage applications from people with disabilities, and upon request we will provide accommodations for candidates participating in any part of our recruitment and selection process.</p> \n <p> #LI-Remote<br> #LI-TK1</p>\n</div>\n<p></p>',
          location: 'Markham, ON',
          address: null,
          employer: 'Everest Clinical Research',
          link: 'https://ca.indeed.com/applystart?jk=e3e60fb0b0ec62e0&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKktNomo8UnXLN-I7Y7ldtqfWO5bPzyK9cDHFFC3RmKGSGFv6K18Ajky37h7_qVokqyM5_BbUBlNwbTZAo0MGfXx1QJs-u7WYgaaiyMjePILWpnJ9l8qi3_R3aVQ3AIoDms94gcitmbiSNdhFvW-hI_9w9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=b742c15a09ab20be&assa=5869',
          createdAt: '2024-07-10T22:02:34.896Z',
          updatedAt: '2024-07-10T22:02:34.896Z',
        },
        {
          benefits: [],
          jobTypes: ['Full-time'],
          attributes: [
            'Azure',
            'CISSP',
            'English',
            'Sailpoint',
            'Business requirements',
            'Cybersecurity',
            'Identity & access management',
          ],
          id: 189,
          externalId: 'fdfab8dedf52d735',
          title: 'Cloud Security Engineer',
          description:
            '<div>\n <div>\n  <div>\n   Job Description\n  </div>\n </div>\n <div></div>\n <div>\n   This position will be located at our Head Office in Markham, Ontario and will have flexibility for both remote and in-office work based on our hybrid work model.\n </div>\n <div></div>\n <div>\n   You will be at the forefront of best-in-class technology and cybersecurity solutions where a strategic mindset combined with a hands-on style will make the most of your day. You will be responsible for a broad set of critical cyber security solutions and services.\n </div>\n <div></div>\n <div>\n   The primary goal of this role is to ensure a progressive, modern, and secure hybrid cloud technology stack is delivering efficient and functional security across the entire Extendicare portfolio seniors care services.\n </div>\n <div></div>\n <div>\n   In this role you will be focused on:\n </div>\n <ul>\n  <li> Defining and documenting architectural and operational cybersecurity standards for people, process and technology that align with IT and organizational tactical and strategic goals.</li>\n  <li> Applying a hands-on approach to implementation while engaging with internal infrastructure and application subject matter experts, business stakeholders and 3rd party vendors.</li>\n  <li> Advising and mentoring team members on operational excellence in the cybersecurity space</li>\n </ul>\n <div>\n  <br> What You Will Do:\n </div>\n <div></div>\n <div>\n   Leadership - Demonstrates leadership in advising, improving, implementing, enforcing, and supporting a best-in-class hybrid cloud cybersecurity stack. Leads and participates in efforts to implement and maintain a robust cybersecurity program.\n </div>\n <div></div>\n <div>\n   Communications - Maintains a highly collaborative and inclusive approach, engaging IT leadership and cross functional technology domain experts to ensure outcomes align with tactical and strategic goals. Working with Business Relationship Managers, acquires, interprets, and translates business requirements into actionable short-term tactical or strategic initiatives.\n </div>\n <div></div>\n <div>\n   Action oriented expert - The action-oriented role performs frequent hands-on configuration, integration and programing activities involving highly complex hybrid cloud technology, security tools, infrastructure, and application platforms. Act as a subject matter expert in a broad set of cybersecurity domains.\n </div>\n <div></div>\n <div>\n   Operational Excellence - Develop and support tactics, techniques and procedures used by the Security Operations Centre (SOC) in monitoring, detection, response, and reporting of Cybersecurity incidents. Analyze complex incidents to determine their root cause. Acts as an expert level consultant when engaged in operational support activities. Embraces knowledge sharing, mentoring, and training opportunities across the team with a goal to reduce operational dependencies and improve continuity of services.\n </div>\n <div></div>\n <div>\n   Qualifications and Experience\n </div>\n <ul>\n  <li> A bachelor’s degree would be nice, but relevant and up to date technology and cybersecurity certifications such as CISSP, CISM, CCSP, Microsoft Azure would also go a long way.</li>\n  <li> 3+ recent years employment where you’re leading the hands-on implementation and support of enterprise cloud security solutions across identity, endpoint, infrastructure, people and data pillars</li>\n  <li> 3+ years professional experience with the Microsoft ecosystem of hybrid cloud and defender security solutions including AD/Azure, M365, CASB, EDR/XDR, MDM, DLP, SIEM, SSO, MFA, PIM</li>\n  <li> Having a prior background in a various infrastructure related technical support position will round out your technical experience and allow you to be successful in this role.</li>\n </ul>\n <div></div>\n <div>\n   What else would be great to have:\n </div>\n <ul>\n  <li> Experience with IAM/IAG solutions such as Okta, SailPoint or Saviynt is considered an asset.</li>\n  <li> Familiar with security and audit frameworks and methodologies including NIST, Zero Trust and Sarbanes–Oxley (SOX); CIS, SOC 1 and SOC2, OWASP</li>\n  <li> Familiar with healthcare standards such as HIPPA and PIPEDA,</li>\n  <li> Experience participating in requirement gathering sessions with diverse stakeholders without</li>\n  <li> Comfortable with early technology adoption, managing change and risk, working in a fast paced, time-sensitive environments and inspiring others to do the same.</li>\n  <li> Ability to document and communicate complex, technical concepts to executive staff, business sponsors and technical resources in simple terms using the English language.</li>\n  <li> Strong sense of curiosity, naturally suspicious, methodical, and risk-based thinker</li>\n </ul>\n <div></div>\n <div>\n   What Extendicare has to offer:\n </div>\n <div>\n   At Extendicare, we believe that working as a team creates an environment that allows us to reach our potential. We value each employee, encourage equal opportunity for growth and recognize achievement. As a valued member of our team, you can expect:\n </div>\n <ul>\n  <li> Continuous mentorship, support for life-long learning and growth opportunities</li>\n  <li> Opportunities for advancement and career growth within the organization</li>\n  <li> A rewarding and meaningful work experience where you can enrich your life and the lives of others through your work.</li>\n  <li> Employee Family Assistance Program.</li>\n  <li> Robust benefits package.</li>\n </ul>\n <div></div>\n <div>\n   Extendicare is a leading provider of care and services for seniors throughout Canada. Through our network of more than 100 operated senior care and living centres, as well as our home health care operations, we are committed to delivering care throughout the health care continuum to meet the needs of a growing seniors’ population in Canada. Our qualified and highly trained workforce of more than 20,000 individuals are united by a dedication to quality care and by our vision of being the best provider of senior care and services in Canada.\n </div>\n <div>\n  <br> #Hybrid\n </div>\n <div>\n   #ExtendicareIT\n </div>\n <div></div>\n <div>\n   Time Type:\n </div>\n <div></div> Full time\n <div></div>\n <div>\n  <div>\n    When you choose to build your career with Extendicare, you’re joining a team dedicated to making a difference. By focusing our energy on enriching the lives of our residents every day, we transform both the quality of their lives and the quality of our own work experiences.\n  </div>\n </div>\n <div></div>\n <div>\n  <div>\n    If you have a passion for caring, turn it into a rewarding career with Extendicare!\n  </div>\n </div>\n <div></div>\n <div>\n   Extendicare and affiliated organizations including our partner homes in Extendicare Assist, accommodate the needs of job applicants throughout its recruitment and selection processes upon request.\n </div>\n</div>',
          location: 'Markham, ON',
          address: null,
          employer: 'Extendicare',
          link: 'https://ca.indeed.com/applystart?jk=fdfab8dedf52d735&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKlLgZ9xhTUmVMi0tXq2NhRKaeRGd9c1pnekDP-unyP4GMf1uRMDo_YIaqgh_N06-GxcY8ztFLlhdO_U7PjIYQzMNReAHuPmD8Dfttt4JW2eGr0JPTnOQCdWTxp4gFeeiMFF6bF8ahDO22n5nIUE1Abqw9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=e8e53c158e0183c2&assa=957',
          createdAt: '2024-07-10T22:14:52.661Z',
          updatedAt: '2024-07-10T22:14:52.661Z',
        },
        {
          benefits: [],
          jobTypes: ['Full-time'],
          attributes: [
            'CSS',
            'React',
            'Kanban',
            'Responsive design',
            'Continuous improvement',
            'JavaScript',
            'Wireframing',
            'Scrum',
            'Agile',
            'Front-end development',
            'HTML5',
          ],
          id: 193,
          externalId: '3d3023174b3dab72',
          title: 'Financial Services/AI, Frontend Engineer',
          description:
            '<div>\n <h3 class="jobSectionHeader"><b>About the Company:</b></h3>\n <ul>\n  <li> Company size: ~300 People</li>\n  <li> Industry: Financial Services, AI </li>\n  <li>TechnologyFounding year: 2012</li>\n  <li> Key Tech: React, JavaScript, HTML, CSS, Agile</li>\n </ul>\n <h3 class="jobSectionHeader"><b> We\'re looking for a Frontend Engineer to:</b></h3>\n <ul>\n  <li> Innovate &amp; Collaborate: Design and develop responsive, interactive web interfaces using HTML, CSS, and JavaScript frameworks like React. Work closely with design and backend teams to bring projects to life.</li>\n  <li> Code Excellence: Write clean, efficient, and maintainable code following industry best practices and coding standards.</li>\n  <li> Performance Optimization: Optimize web applications for maximum speed, scalability, and cross-browser compatibility.</li>\n  <li> Problem-Solving: Debug and troubleshoot issues to ensure seamless user experience across multiple devices.</li>\n  <li> Continuous Improvement: Stay updated with the latest front-end development trends, tools, and techniques. Participate in Agile ceremonies and contribute to improving development processes and workflows.</li>\n </ul>\n <div></div>\n <h3 class="jobSectionHeader"><b><br> What you\'ll need:</b></h3>\n <ul>\n  <li> Technical Expertise: 3+ years of experience with front-end development, including JavaScript frameworks like React.</li>\n  <li> Design Collaboration: Ability to translate design mockups and wireframes into engaging web interfaces.</li>\n  <li> Best Practices: Strong knowledge of HTML, CSS, and JavaScript, focusing on responsive design and accessibility.</li>\n  <li> Agile Experience: Proficiency in Agile methodologies such as Scrum, Lean, or Kanban.</li>\n  <li> Educational Background: Bachelor’s degree or equivalent practical experience.</li>\n </ul>\n <h3 class="jobSectionHeader"><b> What you\'ll get:</b></h3>\n <ul>\n  <li> Competitive Compensation: Attractive salary package with comprehensive benefits.</li>\n  <li> Hybrid Work Environment: A balanced work model to foster collaboration and flexibility.</li>\n  <li> Innovative Projects: Opportunity to work on groundbreaking projects in a fast-paced environment.</li>\n  <li> Career Growth: Be part of a forward-thinking team with opportunities for mentorship and professional development.</li>\n </ul>\n <div>\n   Compensation listed is the salary at an exciting private company commensurate with the level of experience.\n </div>\n</div>',
          location: 'Toronto, ON',
          address: null,
          employer: 'StackedSP Inc',
          link: 'https://ca.indeed.com/applystart?jk=3d3023174b3dab72&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKniKIWdLaxX0uyO-m8cznJ9qrjeNmnCUuS3YNwSLE6hD5ye3L0p-__wjaBXdQtBLqG4OG4u-C_teu6xqQ2vFBClANpnxC1MPga0VSQABKc7tSTfKx8l4Co5dzC25jMHXmOZAA4XU3Q9Prhh0rJmpkZXw9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=c3ee54f6346f18db&assa=1181',
          createdAt: '2024-07-11T02:24:32.478Z',
          updatedAt: '2024-07-11T02:24:32.478Z',
        },
        {
          benefits: [],
          jobTypes: ['Full-time'],
          attributes: [
            'Computer Science',
            'React',
            'Angular',
            'UX',
            'Software development',
            'SDLC',
          ],
          id: 196,
          externalId: '38524fdf5f7377a5',
          title: 'Front-End Engineer II, CreativeX (Amazon Ads)',
          description:
            "<ul> \n <li>3+ years of non-internship professional software development experience</li> \n <li>2+ years of non-internship design or architecture (design patterns, reliability and scaling) of new and existing systems experience</li> \n <li>Bachelor's degree in computer science or equivalent</li> \n <li>Experience building complex software systems that have been successfully delivered to customers</li> \n <li>Experience programming with at least one software programming language</li> \n</ul> Excited to flex your front end skills to build impactful UX solutions and great user experiences in the advertising creatives space? This is an opportunity to work in a dynamic team of developers within Amazon Ads on the Image Generator tool - used by Amazon advertising products to enable advertisers to build dazzling creatives powered by generative AI. \n<br>\n<br> Key job responsibilities \n<br>As a Front-End Engineer II on the Genesis team, you will use your skills and experience to: \n<br>\n<br> \n<ul> \n <li>Design, implement, test, deploy and maintain innovative software solutions</li> \n <li>Employ software engineering best practices to ensure a high standard of quality for all of the team deliverables</li> \n <li>Mentor &amp; grow engineers across the team, leading by example and insisting on high standards</li> \n <li>Work in an agile, startup-like development environment, where experimentation and frequent evaluation and prioritization of our feature backlog is key</li> \n</ul> The ideal candidate should be passionate about building, improving and championing the product accompanied by a strong sense of ownership. \n<br>\n<br> About the team \n<br>The Genesis team is part of the House of Creative Building (HoCB) org - with the goal to be a one-stop shop for advertisers to build beautiful and performant creatives using tools that prioritize modularity, scale, and automation through ML &amp; AI. Our vision is to enable advertisers of all sizes to tell their unique stories through compelling creative assets that delight consumers on &amp; off Amazon. \n<br>\n<br> \n<ul> \n <li>3+ years of full software development life cycle, including coding standards, code reviews, source control management, build processes, testing, and operations experience</li> \n <li>Extremely customer focused</li> \n <li>Experience building reusable UX components or libraries</li> \n <li>Proficiency in modern UX frameworks such as React or Angular</li> \n</ul> Amazon is committed to a diverse and inclusive workplace. Amazon is an equal opportunity employer and does not discriminate on the basis of race, national origin, gender, gender identity, sexual orientation, disability, age, or other legally protected status. If you would like to request an accommodation, please notify your Recruiter.",
          location: 'Toronto, ON',
          address: null,
          employer: 'Amazon Development Centre Canada ULC',
          link: 'https://ca.indeed.com/applystart?jk=38524fdf5f7377a5&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKlItGlKu53O7p5UEkVvYHhQZ0XYUxoBbMotxXzJVgUERlikyJuXW9US02xmyAwPyeX3l1yn7cmae2ZgR0XlAja3HNjIkc1_s0qS5AU8vEEPzwagu6Ri9W30MZzrt6fqj4VUO_9klNqDtpV74-jWG3stw9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=825850c936911f43&assa=6307',
          createdAt: '2024-07-11T18:04:58.885Z',
          updatedAt: '2024-07-11T18:04:58.885Z',
        },
        {
          benefits: [],
          jobTypes: ['Full-time'],
          attributes: [
            'Computer science',
            'Computer Science',
            'Big data',
            'Engineering',
            'Analysis skills',
            'Usability',
            'Agile',
          ],
          id: 199,
          externalId: 'bdfdaa4727fe1225',
          title: 'Software Developer 2',
          description:
            '<div>\n <div>\n  <div>\n   <p><i>This is a flexible position and has the option of working in our Toronto office full time, hybrid throughout the week or working entirely remotely within Canada. </i><i>#LI-REMOTE</i></p>\n   <p> Vena Solutions is seeking a Software Developer to help us expand our sophisticated SaaS cloud technology. This role is a match for you if you are an innovative software engineer with an aptitude for big data and server-side development who loves to be continually challenged to create scalable and performant code.</p>\n   <p> Our developer focused team culture encourages our engineers to be self-motivated and self-directed. We value leadership and people with passion who will take ownership to make their mark on our product within this growing business space.</p>\n   <p> What you will do:</p>\n   <ul>\n    <li> Write clean and elegant code</li>\n    <li> Create robust, speedy production components and develop prototypes quickly</li>\n    <li> Refactor, simplify and optimize code to develop features more effectively</li>\n    <li> Collaborate with cross-functional team members on features, design and implementation and work cohesively to find solutions</li>\n    <li> Contribute to building our environment that embraces continuous integration using automated testing</li>\n    <li> Think outside the box, adapting the latest software technologies while developing innovative functionality to improve software performance and usability</li>\n   </ul>\n   <p> Does this sound like you?:</p>\n   <ul>\n    <li> You have three or more (3+) years of programming experience and exposure to a variety of different programming languages with the ability to pick up new languages and technologies quickly</li>\n    <li> You are a well-rounded programmer, with one or more areas of expertise and depth, and a passion for working throughout product stacks</li>\n    <li> You have a strong knowledge of Computer Science fundamentals including software design, algorithms, etc.</li>\n    <li> You believe in keeping stack current with the latest tools, libraries, frameworks, and trends in cloud technologies</li>\n    <li> You have excellent analytical skills, coupled with a strong sense of ownership and drive</li>\n    <li> You have experience working in an Agile development environment</li>\n    <li> Equivalent experience and/or Post-secondary education in Computer Science, Software Engineering</li>\n   </ul>\n  </div>\n </div>\n</div>\n<p></p>',
          location: 'Toronto, ON',
          address: null,
          employer: 'Vena Solutions Inc.',
          link: 'https://ca.indeed.com/applystart?jk=bdfdaa4727fe1225&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKmFj4wl7gan9RJKEEXjG5xwDwt-JJnXdaECM2f678T9R_6ek1qhszX3-ikivcv38jrzSqe5JWVohsr05nQJ3gVSAQTvMv8x-Sa64EZjcuNPG2HpYqal5re-vgI6PsWic3h6ntH2CDXmcGMqGLU-IYa7w9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=25fd4799c3c8cfeb&assa=6350',
          createdAt: '2024-07-11T18:04:58.885Z',
          updatedAt: '2024-07-11T18:04:58.885Z',
        },
        {
          benefits: [],
          jobTypes: ['Permanent', 'Full-time'],
          attributes: ['English'],
          id: 200,
          externalId: 'a87e8d62ec39d9ea',
          title: 'software engineer',
          description:
            '<div>\n <ul>\n  <li>Education: Bachelor\'s degree</li> \n  <li>Experience: 3 years to less than 5 years</li> \n  <h2 class="jobSectionHeader"><b>Tasks</b></h2>\n  <li> Collect and document user\'s requirements</li>\n  <li> Coordinate the development, installation, integration and operation of computer-based systems</li>\n  <li> Develop process and network models to optimize architecture</li>\n  <li> Evaluate the performance and reliability of system designs</li>\n  <li> Research technical information to design, develop and test computer-based systems</li>\n  <li> Lead and co-ordinate teams of information systems professionals in the development of software and integrated information systems, process control software and other embedded software control systems</li>\n  <li> Assess and troubleshoot applications software</li>\n  <h2 class="jobSectionHeader"><b> Work conditions and physical capabilities</b></h2>\n  <li> Fast-paced environment</li> \n  <li>Work Term: Permanent</li> \n  <li>Work Language: English</li> \n  <li>Hours: 32 hours per week</li>\n </ul>\n</div>',
          location: 'Richmond Hill, ON',
          address: null,
          employer: 'Steer Technologies Inc.',
          link: 'https://ca.indeed.com/applystart?jk=a87e8d62ec39d9ea&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKkPJfXZqG4B9Ho3dNzbMYeXkcx1S-AISHXqJgPuheQsPZ6wi20nPGh3Ov2r-q4sOc2Z8QuQssS_ttZRJWiwUFg0FG5IabrbvT9dUYocdXp-diYU4SaSb1-n3m3q-lGgb04IF2cK_csIzTUtW8SsAfTPw9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=c25d55ed23faade8&assa=6022',
          createdAt: '2024-07-11T22:24:09.862Z',
          updatedAt: '2024-07-11T22:24:09.862Z',
        },
        {
          benefits: [
            'Dental care',
            'Disability insurance',
            'Paid time off',
            'Vision care',
          ],
          jobTypes: ['Full-time'],
          attributes: [
            'Azure',
            'Law',
            'Computer Science',
            'DevOps',
            'SQL',
            'Presentation skills',
            'Machine learning',
            'Software development',
            'AI',
            'Python',
            'Data Science',
          ],
          id: 201,
          externalId: '9fb2e1e0306b8048',
          title: 'Machine Learning Engineer',
          description:
            '<p></p>\n<div>\n <p>We are a leading financial services provider committed to making decisions easier and lives better for our customers and colleagues around the world. From our environmental initiatives to our community investments, we lead with values throughout our business. To help us stand out, we help you step up, because when colleagues are healthy, respected and meaningfully challenged, we all thrive. Discover how you can grow your career, make impact and drive real change with our Winning Team today. </p>\n <p></p>\n <div>\n  <div>\n   <div>\n    <div>\n     <div>\n      <div>\n       <div>\n        <div>\n         <div>\n          <div>\n           <div>\n            <div>\n             <div>\n              <div>\n               <p><b>Working Arrangement </b></p>\n              </div>\n             </div>\n            </div>\n           </div>\n          </div>\n         </div>\n        </div>\n       </div>\n      </div>\n     </div>\n    </div>\n   </div>\n  </div>\n </div>\n <p></p>Hybrid \n <p></p>\n <p><b>Job Description </b></p>\n <p></p>\n <p><b>The Opportunity </b></p>\n <p>We are excited to welcome a passionate Machine Learning Engineer to join our Global Advanced Customer Analytics team at Manulife/John Hancock! In this role, you will be instrumental in using customer data to enhance our products and services and deliver exceptional customer experiences on a global scale.<br> </p>\n <p><br> <b>Responsibilities </b></p>\n <ul>\n  <li>Develop feature engineering components to acquire structured and unstructured data, with a strong emphasis on data modeling techniques during feature engineering and system design. </li>\n  <li>Collaborate with Data Engineers and IT Domain Experts to understand source data, formulate hypotheses, and gain insights prior to designing models, using multi-signal data sources. </li>\n  <li>Develop and deploy machine learning models, using algorithms and techniques such as LLM and Generative AI, using Azure and Databricks platforms. </li>\n  <li>Work closely with partners to gather requirements and implement solutions tailored to meet their needs. </li>\n  <li>Embrace standard methodologies and processes related to MLOps and codify standard methodologies for the broader data science and engineering teams. </li>\n  <li>Apply experience in optimizing model accuracy and runtime performance, employing techniques such as model compression and parallelization. </li>\n  <li>Mentor and provide guidance to junior team members, fostering a culture of continuous learning and improvement. </li>Stay up to date with industry trends and advancements in Machine Learning, Generative AI, and Cloud technologies. \n </ul>\n <p><br> <b>What motivates you? </b></p>\n <ul>\n  <li>You obsess about customers, listen, engage and act for their benefit. </li>\n  <li>You think big, with curiosity to discover ways to use your agile approach and enable business outcomes. </li>\n  <li>You thrive in teams and enjoy getting things done together. </li>\n  <li>You take ownership and build solutions, focusing on what matters. </li>\n  <li>You do what is right, work with integrity and speak up. </li>You share your humanity, helping us build a diverse and inclusive work environment for everyone. \n </ul>\n <p><br> <b>What we are looking for </b></p>\n <ul>\n  <li>An advanced degree in Machine Learning, Data Science, Computer Science, Engineering, or Statistics. </li>\n  <li>Minimum of 5 years of experience applying Machine Learning and Data Science to solve high-impact business problems. </li>\n  <li>Proven experience as a Data/ML Engineer, with a strong emphasis on machine learning, generative AI, and applications of technology. </li>\n  <li>Hands-on experience with Azure tech stack, including Azure cognitive search, Langchain, Vector stores. </li>\n  <li>Strong partner management skills, with the ability to effectively translate sophisticated technical topics into business language, exceptional presentation skills, and the capability to balance a sense of urgency with delivering high-quality and pragmatic solutions. </li>\n  <li>Strong software development skills with proficiency in Python and advanced working knowledge of SQL, preferably using the Azure stack, and experience with Azure ML, Databricks, and Azure Data Factory. </li>\n  <li>Experience in productionizing code through the DevOps pipeline. </li>Solid understanding of machine learning algorithms, statistical modeling, and data analysis techniques. \n </ul>\n <p><br> <b>What can we offer you? </b></p>\n <ul>\n  <li>A competitive salary and benefits packages. </li>\n  <li>A growth trajectory that extends upward and outward, encouraging you to follow your passions and learn new skills. </li>\n  <li>A focus on growing your career path with us. </li>\n  <li>Flexible work policies and strong work-life balance. </li>Professional development and leadership opportunities. \n </ul>\n <p><br> <b>Our commitment to you </b></p>\n <ul>\n  <li><b>Values-first culture: </b>We lead with our Values every day and bring them to life together. </li>\n  <li><b>Boundless opportunity: </b>We create opportunities to learn and grow at every stage of your career. </li>\n  <li><b>Continuous innovation </b>: We invite you to help redefine the future of financial services. </li>\n  <li><b>Delivering the promise of Diversity, Equity and Inclusion: </b>We foster an inclusive workplace where everyone thrives. </li>\n  <li><b>Championing Corporate Citizenship: </b>We build a business that benefits all partners and has a positive social and environmental impact. </li>\n </ul>\n <p></p>\n <p>#LI-Hybrid </p>\n <p></p>\n <p><b>About Manulife and John Hancock </b></p>\n <p></p>\n <p>Manulife Financial Corporation is a leading international financial services group that helps people make their decisions easier and lives better. With our global headquarters in Toronto, Canada, we operate as Manulife across our offices in Asia, Canada, and Europe, and primarily as John Hancock in the United States. We provide financial advice, insurance, and wealth and asset management solutions for individuals, groups and institutions. At the end of 2022, we had more than 40,000 employees, over 116,000 agents, and thousands of distribution partners, serving over 34 million customers. At the end of 2022, we had $1.3 trillion (US$1.0 trillion) in assets under management and administration, including total invested assets of $0.4 trillion (US $0.3 trillion), and segregated funds net assets of $0.3 trillion (US$0.3 trillion). We trade as ‘MFC’ on the Toronto, New York, and the Philippine stock exchanges, and under ‘945’ in Hong Kong. </p>\n <p></p>\n <p><b>Manulife is an Equal Opportunity Employer </b></p>\n <p></p>\n <p><i>At Manulife </i><i>/John </i><i>Hancock </i><i>, we embrace our diversity. We strive to attract, </i><i>develop </i><i>and </i><i>retain </i><i>a workforce that is as diverse as the customers we serve and to foster an inclusive work environment that embraces the strength of cultures and individuals. We are committed to fair recruitment, </i><i>retention, advancement </i><i>and compensation, and we administer all of our practices and programs without discrimination on the basis of race, ancestry, place of origin, </i><i>colour </i><i>, ethnic origin, citizenship, religion or religious beliefs, creed, sex (including pregnancy and pregnancy-related conditions), sexual orientation, genetic characteristics, veteran status, gender identity, gender expression, age, marital status, family status, disability, or any other ground protected by applicable law. </i></p>\n <p></p>\n <p><i>It is our priority to remove barriers to </i><i>provide </i><i>equal access to employment. A Human Resources representative will work with applicants who request a reasonable accommodation during the application process </i><i>. </i><i>All information shared during the accommodation request process will be stored and used in a manner that is consistent with </i><i>applicable laws and Manulife/John Hancock policies </i><i>. To request a reasonable accommodation in the application process, contact </i><i>recruitment@manulife.com </i><i>. </i></p>\n <p></p>\n <div>\n  <div>\n   <div>\n    <div>\n     <div>\n      <div>\n       <div>\n        <p><b>Salary &amp; Benefits </b></p>\n       </div>\n      </div>\n     </div>\n    </div>\n   </div>\n  </div>\n </div>\n <p></p>\n <p>The annual base salary for this role is listed below. </p>\n <p></p>\n <div>\n  <div>\n   <div>\n    <div>\n     <div>\n      <div>\n       <div>\n        <p><b>Primary Location </b></p>\n       </div>\n      </div>\n     </div>\n    </div>\n   </div>\n  </div>\n </div>Toronto, Ontario \n <p></p>\n <p><b>Salary range is expected to be between </b></p>$74,270.00 CAD - $137,930.00 CAD \n <p></p>\n <p>If you are applying for this role outside of the primary location, please contact recruitment@manulife.com for the salary range for your location. The actual salary will vary depending on local market conditions, geography and relevant job-related factors such as knowledge, skills, qualifications, experience, and education/training. Employees also have the opportunity to participate in incentive programs and earn incentive compensation tied to business and individual performance. </p>\n <p></p>\n <p>Manulife offers eligible employees a wide array of customizable benefits, including health, dental, mental health, vision, short- and long-term disability, life and AD&amp;D insurance coverage, adoption/surrogacy and wellness benefits, and employee/family assistance plans. We also offer eligible employees various retirement savings plans (including pension and a global share ownership plan with employer matching contributions) and financial education and counseling resources. Our generous paid time off program in Canada includes holidays, vacation, personal, and sick days, and we offer the full range of statutory leaves of absence. If you are applying for this role in the U.S., please contact recruitment@manulife.com for more information about U.S.-specific paid time off provisions.</p>\n</div>',
          location: 'Toronto, ON',
          address: null,
          employer: 'Manulife',
          link: 'https://ca.indeed.com/applystart?jk=9fb2e1e0306b8048&from=vj&pos=top&mvj=0&spon=0&sjdu=o7sfz71MPdMgyiV0LZq0d4DDplm6SwWjHcxyoDIphKmOzzBawZIHINtnghmRIsm-YCieJm920FPuyBsE-_aan--3iEZy5PQ-SXR2YmmFPl-AWI95CVdekAFFU1_80X-xjXmb3JuApYwiiCzXseSfmYJnxlYO5grsh1jojNh_6S6qWF94WQBZTUBinNGUdV8ew9_XINGINv7OnqX9-Wv1cg&asub=mob&astse=8e678cfc9675d8ed&assa=6025',
          createdAt: '2024-07-11T22:24:09.862Z',
          updatedAt: '2024-07-11T22:24:09.862Z',
        },
        {
          externalId: '9b0e452365ea8a57',
          title: 'Full Stack Developer – HYBRID 80-90/Hr',
          description:
            '<p><b>Overview</b></p>\n<p>NOTE: HYBRID work model, 2-days/week in office. Office located in Toronto.</p>\n<p>Type: <b>5 Month Contract, 8 hours/day, 40 hours/week</b><br>Work Experience: <b>7+ years Full Stack Developer, Snowflake, .NET, C#, SQL, Python, Oracle, Azure, CloudBees, Jenkins, UrbanCode</b><br>Industry: <b>Capital Markets, Investments, Bank</b></p>\n<p><b>DESCRIPTION:</b></p>\n<p>– With supervision and code/design reviews by senior staff, responsible for timely completion of high-quality, well-designed and well-architected systems that use technology appropriately.<br>– Responsible for completing an acceptable volume of work and communicating the status of personal work plans and tasks required to design, develop, and test assigned portions of projects.<br>– Responsible for maintaining currency in technological trends and directions, continually upgrading personal technical and IT-related skills through research, education and self-motivated technology experimentation.<br>– Participate in new technology investigation and recommend new technology adoption where appropriate.</p>\n<p><b>REQUIREMENTS:</b></p>\n<p>– Computer Science or Engineering degree or equivalent working experience<br>– 7+ years of software design/development experience<br>– Sound knowledge of current information systems theories, concepts, and techniques<br>– Good organizational, analytical and problem-solving skills<br>– 7 years experience needed in the following technologies or equivalent:<br><b>.Net, .Net.Core, C#, SQL, Python, Oracle, SQL Server</b><br>– Multi-threading programming<br>– Cloud development or cloud-native development <b>(i.e. Azure) – </b>an asset<br><b>– CI/CD</b> tools (<b>CloudBees, Jenkins, UrbanCode,</b> etc) – an asset<br><b>– Snowflake</b></p>\n<p>Tagged as: .NET, .NET Core, Azure, Bank, Banking, C#, Capital Markets, Cloudbees, Developer, full stack, Hybrid, Investments, Jenkins, Python, Senior Developer, snowflake, UrbanCode</p>\n<p>Job Type: Fixed term contract<br>Contract length: 5 months</p>\n<p>Pay: $80.00-$90.00 per hour</p>\n<p>Expected hours: 37.5 per week</p>\n<p>Flexible Language Requirement:</p>\n<ul>\n <li>French not required</li>\n</ul>\n<p>Schedule:</p>\n<ul>\n <li>Monday to Friday</li>\n</ul>\n<p>Ability to commute/relocate:</p>\n<ul>\n <li>Toronto, ON M5V 3L9: reliably commute or plan to relocate before starting work (preferred)</li>\n</ul>\n<p>Experience:</p>\n<ul>\n <li>.NET: 7 years (preferred)</li>\n <li>.NET Core: 7 years (preferred)</li>\n <li>C#: 7 years (preferred)</li>\n <li>SQL: 7 years (preferred)</li>\n <li>Microsoft SQL Server: 7 years (preferred)</li>\n <li>Python: 7 years (preferred)</li>\n <li>Oracle: 7 years (preferred)</li>\n</ul>\n<p>Location:</p>\n<ul>\n <li>Toronto, ON M5V 3L9 (preferred)</li>\n</ul>\n<p>Work Location: Hybrid remote in Toronto, ON M5V 3L9</p>\n<p>Application deadline: 2024-07-18<br>Expected start date: 2024-07-22</p>',
          location: 'Toronto, ON',
          addresss: '290 Bremner Boulevard, Toronto, ON',
          employer: 'Direct IT Recruiting Inc.',
          benefits: [],
          jobTypes: ['Temporary', 'Fixed term contract'],
          link: 'https://ca.indeed.com/viewjob?jk=9b0e452365ea8a57',
          attributes: [
            'Computer science',
            'Azure',
            'Oracle',
            'Computer Science',
            'Full-stack development',
            'Engineering',
            '.NET Core',
            'C#',
            'Microsoft SQL Server',
            'Research',
            '.NET',
            'SQL',
            'Jenkins',
            'Python',
          ],
        },
        {
          externalId: 'b80f350fc7dc9b82',
          title: 'Web Developer',
          description:
            "<p>The ideal candidate is a creative problem solver who will work in coordination with cross-functional teams to design, develop, and maintain our next generation websites and web tools. You must be comfortable working as part of a team while taking the initiative to take lead on new innovations and projects.</p>\n<p>Responsibilities</p>\n<p>Revise, edit, proofread &amp; optimize web content<br>Work with cross-functionally to enhance overall user experience of our platforms<br>Own various design tasks involved in the web development life cycle from start to finish<br>Able to hand-code HTML and CSS without using packaged web design software<br>Participate in agile software development process and code reviews<br>Implement responsive HTML layouts based on wireframes<br>Implement custom styling based on a style guide and/or design comps</p>\n<p>Qualifications</p>\n<p>Bachelor's degree or equivalent experience in Computer Science<br>At least 1 - 2 years' of experience using HTML, CSS, and JavaScript<br>Proficiency in at least one server-side technology (Java, PHP, NodeJS, Python, Ruby)<br>Ability to multi-task, organize, and prioritize work<br>2+ years experience building web sites<br>Advanced skills with HTML and CSS<br>A passion for high quality UX and attention to detail<br>Knowledge of cross-browser and device compatibility issues and limitations<br>Experience with CSS media queries<br>Knowledge of CSS3 Transitions and Transformations<br>Experience with different image and video formats used to optimize page weight and performance<br>Versed in basic JavaScript</p>\n<p>Compensation: $65,000</p>\n<p>Work remotely</p>\n<ul>\n <li>No</li>\n</ul>\n<p>Job Types: Full-time, Permanent</p>\n<p>Pay: $67,994.00 per year</p>\n<p>Benefits:</p>\n<ul>\n <li>Dental care</li>\n <li>Extended health care</li>\n <li>Paid time off</li>\n</ul>\n<p>Schedule:</p>\n<ul>\n <li>Monday to Friday</li>\n</ul>\n<p>Work Location: In person</p>",
          location: 'Toronto, ON',
          addresss: '505 Eglinton Ave W, Toronto, ON',
          employer: '717990328RT0001',
          benefits: ['Dental care', 'Extended health care', 'Paid time off'],
          jobTypes: ['Permanent', 'Full-time'],
          link: 'https://ca.indeed.com/viewjob?jk=b80f350fc7dc9b82',
          attributes: [
            'Node.js',
            'Computer Science',
            'CSS',
            'Java',
            'PHP',
            'JavaScript',
            'UX',
            'Ruby',
            'Python',
            'HTML5',
          ],
        },
        {
          externalId: 'b93edd50981123db',
          title: 'CNC Programmer',
          description:
            '<p><b>CNC PROGRAMMER</b></p>\n<p><b>Job Overview:</b></p>\n<p>We are seeking a skilled <b>CNC Programmer. </b></p>\n<p>The ideal candidate will have expertise in <b>programming</b> CNC machines.</p>\n<p><b>Knowledge MAZAKs AND MAZUURAs, using MasterCam &amp; SOLIDWORKS software, </b></p>\n<p>to produce high-quality components. This position offers the opportunity to work in a dynamic manufacturing environment. <b>Minimum 2 -3 Years of experience.</b></p>\n<p><b>Responsibilities:</b></p>\n<p>- Develop and write programs for CNC machines based on engineering specifications<br>- Set up and operate CNC machines to fabricate parts with precision<br>- Perform quality checks using calipers, micrometers, and other precision measuring instruments<br>- Interpret blueprints and technical drawings to ensure accurate production<br>- Collaborate with engineering and production teams to optimize manufacturing processes<br>- Utilize CAD software such as SolidWorks and AutoCAD for programming tasks<br>- Conduct inspections using Coordinate Measuring Machines (CMM) for quality assurance<br>- Implement Lean manufacturing principles to enhance efficiency</p>\n<p><b>Qualifications:</b></p>\n<p>- Proficiency in CNC programming and operation<br>- Experience with SolidWorks, AutoCAD, and other CAD software<br>- Familiarity with blueprint reading and GD&amp;T principles<br>- Ability to fabricate components to tight tolerances using various measuring tools<br>- Knowledge of Lean manufacturing practices is a plus<br>- Strong attention to detail and problem-solving skills</p>\n<p>This position offers competitive compensation, opportunities for skill development, and a collaborative work environment. If you possess the required skills and are looking to grow your career as a CNC Programmer, we encourage you to apply.</p>\n<p>Job Type: Full-time</p>\n<p>Pay: $36.00-$40.00 per hour</p>\n<p>Schedule:</p>\n<ul>\n <li>Monday to Friday</li>\n</ul>\n<p>Experience:</p>\n<ul>\n <li>CNC programming: 2 years (Preferred)</li>\n</ul>\n<p>Work Location: In person</p>',
          location: 'Concord, ON',
          addresss: null,
          employer: 'Team Global',
          benefits: [],
          jobTypes: ['Full-time'],
          link: 'https://ca.indeed.com/viewjob?jk=b93edd50981123db',
          attributes: [
            'CNC programming',
            'AutoCAD',
            'Blueprint reading',
            'SolidWorks',
            'Manufacturing',
            'Lean manufacturing',
            'CNC',
          ],
        },
      ],
    }.data;
  }
}
