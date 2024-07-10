import { VertexAI } from "@google-cloud/vertexai";
import "dotenv/config";
import { Atrribute } from "../models/attributes.js";
import { Op } from "sequelize";

const PROJECT_ID = process.env.PROJECT_ID;
const REGION = process.env.GOOGLE_REGION;
const VERTEX_MODEL = process.env.VERTEX_MODEL;



async function checkSkill(attribute) {
    const prompt = `Return "YES" if ${attribute} is a skill, otherwise return "NO"`
    const vertexAI = new VertexAI({ project: PROJECT_ID, location: REGION });
    const generativeModel = vertexAI.getGenerativeModel({
        model: VERTEX_MODEL,
    });
    const resp = await generativeModel.generateContent(prompt);
    const content = resp.response;
    const result = content.candidates.at(0).content.parts.at(0).text
    return {
        attribute,
        isSkill: result == "YES"
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
    let attributesToFind = attributes.filter((attribute) => !foundAtrributeIds.includes(attribute));

    let newAttributes = await Promise.all(attributesToFind.map(async attribute => await checkSkill(attribute)))

    let newAttributeWithId = await Atrribute.bulkCreate(newAttributes)

    return attributes.concat(newAttributeWithId)
}




let test = ["Extended health care,Computer Science,CSS,React,Web development,Enterprise software,Full-time,Java,SQL,AWS,Docker,Paid time off,Ruby on Rails,JavaScript,SASS,Software development,Python,Spring,HTML5",
    "CI/CD,Casual dress,Law,Computer Science,Kubernetes,DevOps,Full-time,English,Java,Master's degree,AWS,Docker,Bachelor's,Machine learning,Paid time off,JavaScript,Work from home,French not required,Software development,Hybrid work,Agile,S3,JSON,Monday to Friday,DynamoDB,AI,Leadership,Jenkins,Communication skills,Flexible schedule,Spring,Hibernate",
    "Profit sharing,Computer science,Permanent,Operating systems,Computer Science,XML,DB2,Relational databases,DevOps,Git,SQL,Dental care,Bachelor's,Usability,Web services,Test cases,Apache,College diploma,Communication skills,HTML5,MySQL",
    "MVC,Computer Science,Data structures,Full-time,Java,Master's degree,C++,C,Bachelor's,APIs,Communication skills,Python",
    "Go,DevOps,Full-time,Remote,Clojure,Bonus pay,On call",
    "MVC,Computer Science,Data structures,Full-time,Java,Master's degree,C++,C,Bachelor's,APIs,Communication skills,Python",
    "Web accessibility,CI/CD,Computer science,Extended health care,TCP,Node.js,Computer Science,CSS,React,DevOps,Engineering,Full-time,Dental care,Docker,Bachelor's,Paid time off,JavaScript,No university degree,Usability,REST,SEO,Work from home,French not required,Software development,Hybrid work,GitHub,APIs,Vision care,Monday to Friday,Unit testing,In-person,GraphQL,gRPC,TypeScript,Communication skills,HTML5",
    "Cloud infrastructure,Doctoral degree,Computer Science,NumPy,Post-secondary education,Master's degree,Pandas,Machine learning,PostgreSQL,REST,SciPy,APIs,Linux,GraphQL,DynamoDB,Python,HTML5,MySQL",
    "Filing,Full-time,High school diploma or GED,Bachelor's,Driving,In-person,Driving Licence",
    "CI/CD,Kotlin,SAFe,MVC,Gradle,XML,Full-time,Git,Android,Java,Application development,SOAP,Bachelor's,No university degree,SDKs,REST,UX,Hybrid work,APIs,Agile,Web services,Design thinking,JSON,GraphQL,Pair programming,Android development,Communication skills,Debugging,Experience design,Design patterns",
    "Extended health care,RRSP match,Permanent,JD Edwards,SAP,Engineering,Post-secondary education,Full-time,Process improvement,NoSQL,Metal fabrication,Morning shift,Dental care,PHP,Programmable logic controllers,No university degree,SolidWorks,In-person,Manufacturing,Life insurance,HTML5,MySQL",
    "Computer Science,CSS,React,Web development,C#,Full-time,Java,Analysis skills,C++,C,Bachelor's,JavaScript,No university degree,TypeScript,Communication skills,Python,High availability",
    "Node.js,React,Full-stack development,AWS,Ruby on Rails,JavaScript,Ruby,APIs,TypeScript,Communication skills,HTML5",
    "Computer science,Wellness program,RRSP match,Oracle,Computer Science,Customer service,Full-time,Java,Dental care,Bachelor's,Paid vacation,Hybrid work,APIs,PL/SQL,Communication skills",
    "Overtime,Overtime pay,Full-time,English,Application development,Dental care,Bachelor's,Monday to Friday,Life insurance",
    "8 hour shift,Permanent,Computer Science,Internet of things,Full-time,Remote,Java,OOP,Bachelor's,Work from home,APIs,Linux,Spring,MySQL",
    "Kotlin,CSS,React,Remote,Java,JavaScript,PostgreSQL,RabbitMQ,REST,Angular,APIs,Agile,GraphQL,DynamoDB,Restaurant,TypeScript",
    "Jira,Kotlin,Extended health care,Permanent,Computer Science,Mobile applications,Test automation,Full-time,Test-driven development,Android,Java,Dental care,Bachelor's,Confluence,SDKs,REST,UX,Hybrid work,APIs,Web services,UI,Monday to Friday,Android development,React Native",
    "CI/CD,Cloud infrastructure,Node.js,Computer Science,Big data,DevOps,Engineering,Full-time,Git,Java,Bash,Databases,AWS,Docker,Bachelor's,Terraform,Computer networking,APIs,S3,Linux,DynamoDB,Business,Python,Shell Scripting,Identity & access management",
    "CNC programming,Extended health care,8 hour shift,Permanent,Overtime,Overtime pay,Afternoon shift,Full-time,High school diploma or GED,Machining,Day shift,In-person,CNC",
    "Commission pay,Azure,Sales,LAN,Full-time,Dental care,AWS,Tuition reimbursement,Paid time off,Computer networking,Vision care,Network engineering,Childcare assistance,Analytics",
    "Web accessibility,Temporary,Azure,Oracle,MVC,Node.js,CSS,Full-stack development,WebSphere,DevOps,Full-time,Responsive design,Java,Application development,Databases,SQL,No weekends,JavaScript,JPA,French not required,Angular,Software development,Hybrid work,Day shift,Monday to Friday,Fixed term contract,TypeScript,Communication skills,Information management,Spring,Negotiation,Debugging,HTML5,Spring MVC,SDLC",
    "Oracle,Go,React,Mobile applications,iOS,Full-time,English,.NET,Dental care,Bachelor's,Ruby on Rails,JavaScript,Computer hardware,Day shift,Computer skills,Web services,Monday to Friday,In-person,Vue.js,Communication skills,Python",
    "Microsoft Word,Microsoft Excel,Microsoft Outlook,Full-time,Microsoft Office,Bachelor's,Organizational skills",
    "Extended health care,8 hour shift,Permanent,Overtime,Overtime pay,Fanuc,Full-time,Calipers,Dental care,Machining,Vision care,Monday to Friday,In-person,Robotics,CNC",
    "Extended health care,Permanent,CSS,Mobile applications,iOS,English,Java,SQL,Dental care,C++,C,Bachelor's,JavaScript,APIs,Computer skills,Vision care,JSON,Monday to Friday,In-person,College diploma,Python,MySQL",
    "Lucene,Computer Science,Engineering,Full-time,Java,Databases,AWS,Distributed systems,Computer Engineering,Scrum,Agile,Solr,Cybersecurity,Communication skills,MySQL,Analytics",
    "Casual dress,Computer science,Extended health care,RRSP match,Node.js,Computer Science,CSS,React,Kubernetes,Employee stock purchase plan,Disability insurance,NoSQL,Java,Databases,Dental care,OOP,AWS,Docker,JavaScript,No university degree,Bonus pay,Software development,Employee assistance program,Communication skills,Python,Life insurance,HTML5",
    "JUnit,Relational databases,Tomcat,Designated paid holidays,Full-time,Git,Java,SQL,Dental care,Paid time off,Work from home,Agile,Linux,Vision care,In-person,Maven,Jenkins,JMS,Spring,Life insurance,Hibernate,MySQL",
    "Extended health care,8 hour shift,Permanent,Full-time,English,Dental care,Bachelor's,Blueprint reading,Vision care,In-person,Mechanical knowledge",
    "8 hour shift,Computer Science,Engineering,Full-time,Analysis skills,Bachelor's,Django,Monday to Friday,In-person,Flask,Communication skills,Python",
    "Spring Boot,Temporary,Azure,Kubernetes,Kanban,DevOps,Quality management,J2EE,.NET,Java,Microservices,Product development,Cloud development,Scrum,Software development,Hybrid work,GitHub,Agile,Monday to Friday,Fixed term contract,Business requirements,SDLC",
    "Bilingual,French,Authentication,Extended health care,Azure,Oracle,Gradle,CSS,Software Engineering,React,XML,DB2,Engineering,Microsoft SQL Server,Full-time,Git,English,Java,SOAP,SQL,Bachelor's,REST,Sailpoint,Hybrid work,JSON,JDBC,Jenkins,Spring,jQuery,Active Directory,Hibernate,MySQL,Identity & access management,Information Technology",
    "Bilingual,French,Wellness program,CSS,Full-time,NoSQL,English,.NET,Databases,SQL,PHP,Analysis skills,JavaScript,Hybrid work,Employee assistance program",
    "RRSP match,Stock options,Weekends as needed,Kubernetes,Ansible,IIS,Relational databases,Load balancing,Tomcat,C#,System architecture,Full-time,Java,Databases,OOP,Docker,Terraform,Scripting,In-person,On call,Communication skills,Flexible schedule",
    "CNC programming,8 hour shift,Full-time,In-person,CNC",
    "Azure,Computer Science,Full-stack development,DevOps,Engineering,Visual Studio,C#,Full-time,Git,English,.NET,Graphic design,Bachelor's,Travel,Customer relationship management,Software development,Hybrid work,Front-end development,In-person,Communication skills",
    "Jira,Commission pay,Azure,Node.js,Weekends as needed,Ansible,Nights as needed,DevOps,Full-time,Git,Research,AWS,Tuition reimbursement,Confluence,Terraform,Computer networking,Scrum,APIs,Agile,S3,DynamoDB,AI,RDS,Leadership,TypeScript,Communication skills,Python,Life insurance,Identity & access management,Analytics",
    "JBoss,FTP,Casual dress,Extended health care,TCP,UI development,8 hour shift,Permanent,MVC,Gradle,Computer Science,JUnit,React,Kubernetes,Ansible,Relational databases,Engineering,Post-secondary education,Full-time,NoSQL,Selenium,MongoDB,Java,Microservices,SQL,Dental care,PHP,OOP,Bachelor's,SSL,Paid time off,JavaScript,PostgreSQL,Continuous integration,REST,LDAP,Computer Engineering,Scripting,Angular,Software development,Agile,Company events,Web services,Puppet,SSH,Linux,Vision care,Monday to Friday,Apache,In-person,JDBC,GraphQL,Chef,Maven,Holidays,Jenkins,LAMP stack,Communication skills,Python,Spring,Life insurance,Hibernate,MySQL,On-site parking",
    "CNC programming,AutoCAD,Full-time,Calipers,English,Hotel,Machining,Quality assurance,Night shift,SolidWorks,Autodesk Inventor,Manufacturing,College diploma,Time management",
    "Microsoft Powerpoint,Microsoft Word,Permanent,Microsoft Excel,Microsoft Outlook,Adobe Illustrator,Full-time,Microsoft Office,Bachelor's,Product development,Communication skills,Time management",
    "Computer science,Mobile applications,C#,iOS,Full-time,Unity",
    "Jira,Permanent,Business intelligence,Part-time,DevOps,Full-time,English,C++,C,Bachelor's,Computer skills,Communication skills",
    "Bilingual,French,Adobe Photoshop,Extended health care,Access to vehicle required,Adobe Lightroom,Post-secondary education,Adobe Illustrator,Full-time,English,Microsoft Office,Adobe Creative Suite,Graphic design,Dental care,Bachelor's,Paid time off,Company pension,Travel,Adobe Premiere,Work from home,Day shift,Computer skills,Company events,Vision care,Monday to Friday,In-person,Adobe InDesign,Moodle,Life insurance,Instructional design,On-site parking,Up to 25% travel",
    "Cloud infrastructure,Permanent,Azure,Computer Science,PMP,DevOps,Engineering,ERP systems,CISSP,Full-time,Google Cloud Platform,AWS,Analysis skills,Project management,Bachelor's,Travel,SharePoint,Cloud computing,Business requirements,Business,Leadership,Communication skills",
    "Extended health care,Permanent,Node.js,Computer Science,CSS,React,XML,Full-stack development,Writing skills,Full-time,NoSQL,Git,MongoDB,E-commerce,.NET,Databases,SQL,Dental care,AWS,C++,Bachelor's,Paid time off,JavaScript,Version control systems,Angular,Hybrid work,APIs,Company events,Vision care,JSON,Monday to Friday,Communication skills,Python,HTML5",
    "WebSphere,SAS,DB2,Visio,Microsoft Office,SQL,CICS,Contract,Fixed term contract,Microsoft Project,Communication skills,Debugging",
    "CI/CD,AJAX,RRSP match,Azure,MVC,Management,Computer Science,DevOps,Engineering,C#,Microsoft SQL Server,Full-time,.NET,Database design,AWS,Bachelor's,Tuition reimbursement,JavaScript,SharePoint,Software development,Monday to Friday,Telerik,Kendo,Leadership,Python,Time management",
    "Node.js,CSS,React,JavaScript,REST,Natural language processing,GitHub,Web services,UI,HTML5",
    "Microsoft Windows Server,French,CI/CD,System administration,Azure,Computer Science,Kubernetes,DevOps,Full-time,Git,Master's degree,Dental care,OOP,Firewall,AWS,Analysis skills,Quality assurance,Docker,Bachelor's,No university degree,Computer networking,Software development,Hybrid work,APIs,Agile,Linux,Vision care,Kafka,Business requirements,Business,Communication skills,SDLC",
    "Permanent,Dental care,Supervising experience,Paid vacation,Day shift,Monday to Friday,Manufacturing,Leadership",
    "Computer science,Kotlin,8 hour shift,MVC,Computer Science,JUnit,Software Engineering,iOS development,Engineering,iOS,Test automation,Full-time,Objective-C,Git,Test-driven development,Android,Java,SOAP,OOP,SDKs,REST,Computer networking,UX,Agile,Swift,Android development,Communication skills,Design patterns",
    "CI/CD,Knowledge management,ASP.NET,Temporary,Azure,Kanban,Customer service,DevOps,.NET Core,C#,Full-time,PaaS,.NET,SQL,No weekends,Case management,JavaScript,French not required,Hybrid work,Day shift,APIs,Agile,Monday to Friday,Fixed term contract,SaaS,Entity Framework,IaaS",
    "CI/CD,SAFe,iOS development,XML,iOS,Full-time,Objective-C,Git,SOAP,Bachelor's,No university degree,REST,UX,Hybrid work,Agile,Web services,Design thinking,JSON,GraphQL,Swift,Pair programming,Communication skills,Debugging,Experience design,Design patterns",
    "Fanuc,CNC laser cutting,Full-time,High school diploma or GED,CNC milling machine,Monday to Friday,In-person,CNC",
    "Microsoft Powerpoint,Microsoft Word,Microsoft Excel,XML,Visio,Microsoft Office,Cerner,SQL,Contract,Fixed term contract,Microsoft Project",
    "CI/CD,Wellness program,Node.js,Computer Science,Kubernetes,Ansible,DevOps,Engineering,Full-time,Mathematics,.NET,PHP,AWS,Analysis skills,Project management,Docker,Bachelor's,Cloud development,JavaScript,No university degree,Redis,SDKs,New Relic,Hybrid work,Employee assistance program,S3,Web services,Apache,Jenkins,Communication skills,Python,NGINX,Debugging,High availability,Time management,Identity & access management,Design patterns",
    "Computer science,Microsoft Excel,Mobile applications,C#,iOS,Full-time,Unity",
    "CI/CD,Wellness program,Node.js,CSS,WordPress,Full-time,NoSQL,Git,Google Cloud Platform,.NET,SQL,PHP,AWS,Docker,JavaScript,Version control systems,Redis,New Relic,Hybrid work,APIs,Employee assistance program,Unit testing,Vue.js,On call,TypeScript,Software architecture,HTML5,MySQL,Design patterns",
    "CNC programming,AutoCAD,Extended health care,Cover letter,Permanent,Overtime,Overtime pay,CAD,Full-time,Disability insurance,10 hour shift,Master's degree,Dental care,Machining,Paid time off,Quality Control,French not required,Blueprint reading,SolidWorks,Day shift,Company events,Vision care,Monday to Friday,In-person,Manufacturing,Mechanical knowledge,CNC,Life insurance,Time management",
    "Casual dress,Extended health care,RRSP match,8 hour shift,Data modeling,Permanent,Relational databases,Mobile applications,Full-time,Disability insurance,Java,On-site gym,Dental care,Analysis skills,Paid time off,JavaScript,REST,Work from home,French not required,Angular,Hybrid work,Day shift,APIs,Web services,Linux,Monday to Friday,In-person,On call,TypeScript,Communication skills,Flexible schedule,Life insurance,HTML5,MySQL,On-site parking",
    "CI/CD,Elasticsearch,Wellness program,.NET Core,C#,Full-time,NoSQL,Git,Google Cloud Platform,MongoDB,.NET,SQL,AWS,Docker,PostgreSQL,Version control systems,Redis,New Relic,Hybrid work,APIs,Employee assistance program,Software architecture,Design patterns",
    "8 hour shift,Azure,Node.js,Computer Science,React,Full-time,Git,Google Cloud Platform,Java,Databases,AWS,Bachelor's,JavaScript,Angular,Project management software,Agile,Monday to Friday,In-person,Python,Information Technology",
    "Microsoft Windows Server,French,System administration,Computer Science,Database development,Relational databases,DevOps,Full-time,Master's degree,Dental care,OOP,Firewall,Analysis skills,Quality assurance,Bachelor's,No university degree,Computer networking,Software development,Hybrid work,Agile,Linux,Vision care,Business requirements,Business,Communication skills,SDLC",
    "Wellness program,Computer Science,React,Web development,Full-stack development,Kanban,Full-time,Git,English,.NET,SQL,Docker,Bachelor's,PostgreSQL,No university degree,Version control systems,Usability,REST,Hybrid work,APIs,Agile,Employee assistance program,Integration testing,Unit testing,Vue.js,On call,Python,Time management",
    "Permanent,XML,Salesforce,DevOps,Git,SOAP,Release management,REST,Software development,APIs,Agile,Web services,JSON,Maven,Jenkins,SDLC",
    "Azure,MVC,CSS,Immediate opening,Web development,Enterprise software,C#,Microsoft SQL Server,.NET,Application development,Databases,SQL,JavaScript,Angular,UX,Contract,Software development,APIs,Agile,Web services,Fixed term contract,Communication skills,Information management,Negotiation,Debugging,HTML5,SDLC,Design patterns",
    "Casual dress,Extended health care,RRSP match,8 hour shift,Permanent,Node.js,CSS,React,Full-stack development,Customer service,DevOps,Laravel,Full-time,NoSQL,MongoDB,Databases,SQL,Dental care,PHP,AWS,Paid time off,JavaScript,No university degree,Version control systems,REST,Bonus pay,GitHub,APIs,Web services,Vision care,Monday to Friday,In-person,Communication skills,HTML5,High availability",
    "Casual dress,Extended health care,Wellness program,8 hour shift,Program management,Permanent,Computer Science,Logistics,Full-time,Disability insurance,Master's degree,Dental care,Content creation,Presentation skills,Bachelor's,Paid time off,Product management,Travel,Work from home,Company events,Vision care,Monday to Friday,In-person,Life insurance,Up to 25% travel",
    "Spring Boot,Azure,Bootstrap,Kubernetes,Immediate opening,Full-stack development,DevOps,Java,Microservices,AWS,REST,Angular,Contract,Hybrid work,APIs,Agile,JSON,Unit testing,Fixed term contract,Business requirements,TypeScript",
    "CI/CD,Wellness program,Full-time,NoSQL,Git,Google Cloud Platform,.NET,SQL,AWS,Docker,Version control systems,Redis,New Relic,Hybrid work,APIs,Employee assistance program,Unit testing,Vue.js,TypeScript,Python,Software architecture,MySQL,Design patterns",
    "CI/CD,Commission pay,Cloud infrastructure,Node.js,Part-time,DevOps,PaaS,Research,AWS,Tuition reimbursement,Terraform,Computer networking,Linux,TypeScript,Communication skills,Python,IaaS,Life insurance,Identity & access management,Analytics",
    "Bilingual,Performance tuning,Computer science,Drupal,Data modeling,Oracle,Statistics,Computer Science,Full-time,Mathematics,AWS,Night shift,No university degree,Day shift,APIs,Monday to Friday,PL/SQL,Communication skills",
    "MATLAB,Permanent,CAD,Fanuc,Engineering,Mechanical Engineering,English,Assembly,C++,Project management,Simulink,SolidWorks,Robotics,Python,CATIA,German",
    "FTP,SFTP,TCP,Visual Studio,OOP,C++,C,TCP/IP,SaaS",
    "CI/CD,Fiddler,Authentication,Commission pay,Microsoft Access,Azure,Cloud architecture,Node.js,Computer Science,Engineering,Encryption,CISSP,Full-time,Bash,PKI,AWS,Nessus,Incident response,Bachelor's,Tuition reimbursement,SSL,Metasploit,Perl,Scripting,Burp Suite,Computer networking,Ruby,APIs,IT,Nmap,Cybersecurity,Leadership,Communication skills,Python,PowerShell,Shell Scripting,Life insurance,Time management,Identity & access management,Analytics",
    "Jira,CI/CD,ISTQB Certification,Computer Science,XML,Engineering,Selenium,Git,Java,SOAP,SQL,C,Bachelor's,No university degree,REST,Hybrid work,APIs,Software testing,JSON,Python",
    "Jira,Wellness program,Computer Science,Relational databases,C#,Microsoft SQL Server,Full-time,English,J2EE,.NET,Java,SOAP,SQL,Database design,Database administration,OOP,Project management,Bachelor's,Microsoft Dynamics GP,REST,Scripting,Hybrid work,APIs,Employee assistance program,JMS,Communication skills,Data warehouse,T-SQL,Design patterns",
    "8 hour shift,Computer Science,DocuSign,Salesforce,Engineering,Full-time,Git,SOAP,No university degree,REST,Scrum,Day shift,Agile,System development,Communication skills",
    "Microsoft Powerpoint,Microsoft Word,Statistical software,Extended health care,Permanent,System administration,Microsoft Excel,Microsoft Outlook,Statistics,Computer Science,XML,SAS,Data analysis skills,Full-time,English,Master's degree,Dental care,Machine learning,Paid time off,Paid vacation,Hybrid work,Vision care,Monday to Friday,Life insurance,Time management",
    "Data modeling,Azure,Computer Science,Relational databases,C#,Microsoft SQL Server,Full-time,Git,Information Systems,SQL,Database design,AWS,Bachelor's,Version control systems,Software development,Communication skills,Python,T-SQL",
    "Oracle,Computer Science,CSS,React,Engineering,Designated paid holidays,Microsoft SQL Server,Full-time,Java,Dental care,Bachelor's,Product development,Paid time off,JavaScript,SASS,Work from home,Angular,Agile,Vision care,In-person,SaaS,Communication skills,Spring,Life insurance,MySQL",
    "Spring Boot,Elasticsearch,Azure,Go,Computer Science,React,Relational databases,DevOps,Engineering,C#,Java,AWS,Docker,Bachelor's,JavaScript,Usability,REST,Hybrid work,APIs,Data visualization,Python,Software architecture,MySQL",
    "Computer Science,CSS,React,Git,Java,SQL,Bachelor's,JavaScript,Linux",
    "Backbone.js,CSS,English,JavaScript,Less,HTML5",
    "Permanent,Part-time,Full-time,English,Bachelor's,No university degree",
    "System administration,Computer Science,Remote,Debian,Bachelor's,Ubuntu,Work from home,Linux,Python",
    "Computer science,Cover letter,CSS,iOS development,Android,SSL,JavaScript,Work from home,Internship / Co-op,Android development,Flexible schedule,HTML5",
    "Internship / Co-op",
    "Kotlin,React,Remote,Android,Java,PostgreSQL,RabbitMQ,Agile,GraphQL,DynamoDB,Android development,Restaurant",
    "Permanent,Full-time,English,Bachelor's,Communication skills",
    "CI/CD,Permanent,Gradle,Computer Science,Kubernetes,Full-stack development,Engineering,Test automation,Git,Java,Databases,Functional testing,SQL,Docker,Bachelor's,Tuition reimbursement,JavaScript,Splunk,Hybrid work,APIs,Agile,Linux,Eclipse,Integration testing,Maven,Jenkins,Shell Scripting",
    "MATLAB,Power BI,Microsoft Excel,Engineering,Full-time,Visio,English,Microsoft Office,.NET,Databases,Dental care,Paid time off,SharePoint,VBA,Vision care,Leadership,Python",
    "CI/CD,MVC,ASP.NET Core,CSS,React,DevOps,.NET Core,C#,Microsoft SQL Server,Full-time,.NET,Databases,Microservices,SOAP,Dental care,AWS,JavaScript,Terraform,Paid vacation,RabbitMQ,REST,Angular,Scrum,Software development,APIs,Agile,Company events,Employee assistance program,S3,Web services,Unit testing,Service-oriented architecture,DynamoDB,Vue.js,Leadership,Communication skills,Flexible schedule,Entity Framework,HTML5",
    "Computer Science,Spark,Full-time,Apache Hive,AWS,Bachelor's,Distributed systems,Software development,DynamoDB,SDLC,Hadoop",
    "Permanent,Part-time,Full-time,English,Bachelor's",
    "Power BI,Azure,Microsoft SQL Server,Tableau,SQL,Analysis skills,Contract,Hybrid work,GitHub,Unit testing,Fixed term contract,Python",
    "Casual dress,Extended health care,Computer Science,Part-time,Software Engineering,Engineering,Full-time,English,Java,Application development,Dental care,Analysis skills,Bachelor's,Paid time off,No university degree,Work from home,Hybrid work,Monday to Friday,Business requirements,Leadership,Communication skills,Python,Life insurance",
    "Temporary,ASP.NET Core,Computer Science,SAP,Engineering,.NET Core,C#,Microsoft SQL Server,Git,.NET,SQL,Bachelor's,JavaScript,French not required,APIs,Web services,Monday to Friday,In-person,Fixed term contract,SAP BusinessObjects,HTML5",
    "Temporary,8 hour shift,Azure,React,Full-time,Google Cloud Platform,Java,AWS,Angular,Software development,Hybrid work,APIs,In-person,Fixed term contract",
    "Data modeling,Full-time,Databases,SQL,Metadata,Informatica",
    "Spring Boot,Elasticsearch,Azure,Go,Computer Science,React,Relational databases,DevOps,Engineering,C#,Java,AWS,Docker,Bachelor's,JavaScript,Usability,REST,Hybrid work,APIs,Data visualization,Python,Software architecture,MySQL",
    "React,WordPress,Full-time,Git,PHP,JavaScript,Travel,Redis,ECMAScript,REST,Work from home,GitHub,Day shift,APIs,Agile,Front-end development,MySQL",
    "Temporary,Azure,English,Information security,AWS,Bachelor's,Sailpoint,Test cases,In-person,Fixed term contract,Leadership,Identity & access management",
    "Temporary,8 hour shift,Computer Science,Ansible,DevOps,Full-time,Java,Application development,AWS,Bachelor's,REST,Work from home,Scrum,Hybrid work,APIs,Agile,S3,Fixed term contract,DynamoDB,Jenkins,Python",
    "Computer science,Data structures,Test automation,Full-time,Java,OOP,JavaScript,Hybrid work,Communication skills,Python",
    "Jira,Spring Boot,UI development,Azure,Oracle,Computer Science,Bootstrap,DevOps,Microsoft SQL Server,Full-time,SSRS,Research,Java,Databases,Analysis skills,Bachelor's,Confluence,Angular,APIs,ServiceNow,Kafka,In-person,SSIS,College diploma",
    "CI/CD,Power BI,Azure,Oracle,Computer Science,XML,Visual Basic,DevOps,C#,Microsoft SQL Server,Full-time,SSRS,Git,Windows,Java,SQL,Version control systems,Perl,Hybrid work,JSON,Business requirements,TFS,Leadership,Jenkins,Communication skills,Python,HTML5,MySQL,High availability,Time management",
    "Bilingual,French,CI/CD,Azure,DevOps,English,.NET,Python",
    "Wellness program,Azure,Full-time,.NET,SQL,Bachelor's,Machine learning,Hybrid work,Employee assistance program,Model training,Communication skills,Python",
    "Extended health care,Go,Computer Science,Full-time,English,SQL,Dental care,Bachelor's,Paid time off,Ruby on Rails,JavaScript,Software development,Hybrid work,Linux,Monday to Friday",
    "Node.js,Computer Science,Mobile applications,iOS,Remote,Master's degree,Application development,Bachelor's,JavaScript,Scrum,APIs,Agile,Leadership,TypeScript,Communication skills,React Native",
    "Microsoft Windows Server,French,System administration,Computer Science,Database development,Relational databases,DevOps,Tomcat,Full-time,Weblogic,Master's degree,Dental care,OOP,Firewall,Analysis skills,Quality assurance,Bachelor's,No university degree,Computer networking,Software development,Hybrid work,Agile,Linux,Vision care,Business requirements,Business,Communication skills,Identity & access management,SDLC",
    "Cloud infrastructure,Cloud architecture,Computer Science,React,DevOps,C#,Post-secondary education,Test automation,Microsoft SQL Server,Full-time,J2EE,Windows,.NET,Java,Application development,Databases,SQL,Dental care,Database administration,WCF,Quality assurance,JSP,Software development,Hybrid work,APIs,ADO.NET,Agile,Web services,Design thinking,Communication skills,Entity Framework,Mobile devices,T-SQL,SDLC",
    "Elasticsearch,MVC,Computer Science,CSS,React,Kanban,.NET Core,C#,Post-secondary education,Full-time,NoSQL,Git,MongoDB,.NET,Microservices,SQL,Dental care,AWS,Docker,SVN,JavaScript,Redis,Paid vacation,RabbitMQ,Usability,Redux,Computer Engineering,QuickBooks,Angular,Hybrid work,APIs,Agile,Company events,Linux,Vision care,Integration testing,TFS,gRPC,Jenkins,Communication skills,Python,HTML5",
    "Extended health care,Computer Science,React,Engineering,Spark,Java,Bachelor's,Paid time off,Scala,Angular,Internship / Co-op,Communication skills,Python,Spring,Hadoop",
    "Go,Node.js,Computer Science,React,Engineering,Full-time,AWS,Bachelor's,PostgreSQL,Redis,DynamoDB,AI,TypeScript,Python,React Native",
    "Designated paid holidays,Git,Application development,C++,C,Paid vacation,Contract,Hybrid work,GitHub,Linux,ARM,Fixed term contract,Multithreading,Mechanical knowledge",
    "Temporary,Enterprise software,System architecture,OOP,Software development,Hybrid work,Monday to Friday,Fixed term contract,SDLC",
    "CI/CD,Permanent,Node.js,React,Full-time,NoSQL,Microservices,SQL,PHP,AWS,Analysis skills,Docker,JavaScript,Distributed systems,Angular,Vue.js,Solution architecture,AI,TypeScript,Communication skills,Python,Debugging",
    "Computer Science,Engineering,Dental care,OOP,Bachelor's,JavaScript,Scripting,Unit testing,Adobe InDesign,Communication skills,Lua",
    "CI/CD,Knowledge management,ASP.NET,Temporary,Azure,Kanban,Customer service,DevOps,.NET Core,C#,PaaS,Microsoft Dynamics 365,.NET,Application development,SQL,Bachelor's,Case management,JavaScript,French not required,Software development,Hybrid work,APIs,Agile,Monday to Friday,Fixed term contract,SaaS,Communication skills,Entity Framework,IaaS",
    "Web accessibility,ASP.NET,Azure,MVC,Computer Science,CSS,Immediate opening,XML,Full-stack development,DevOps,Engineering,.NET Core,C#,SQL,JavaScript,SASS,Contract,APIs,Agile,Less,JSON,Fixed term contract,HTML5",
    "Doctoral degree,Computer Science,Mathematics,Finance,Master's degree,C++,Physics,Contract,Fixed term contract,Communication skills,Python",
    "Network administration,System administration,Doctoral degree,Computer Science,Weekends as needed,Engineering,Full-time,Mathematics,Windows,Technical support,Master's degree,AWS,Bachelor's,Rotating shift,Distributed systems,Computer networking,Work from home,Hybrid work,Portuguese,Customer support,Linux,In-person,Flexible schedule,Hadoop,Information Technology",
    "CPR Certification,Permanent,Post-secondary education,Call to connect,Dental care,Supervising experience,First Aid Certification,Case management,Computer skills,Communication skills,Time management",
    "Permanent,Full-time,English,Bachelor's,JavaScript,JSON",
    "Kotlin,Git,Java,C++,Project management,Continuous integration,Software development,GitHub,Agile,Unit testing,Service-oriented architecture,Jenkins,Communication skills",
    "Computer Science,Big data,Spark,Remote,Java,Master's degree,Bachelor's,JavaScript,Distributed systems,Scala,REST,Scrum,Software development,APIs,Agile,Kafka,GraphQL",
    "CSS,Full-time,Java,JavaScript,HTML5",
    "CI/CD,Casual dress,Extended health care,Permanent,Node.js,React,Full-time,Disability insurance,Dental care,AWS,Paid time off,Django,Company events,Vision care,Monday to Friday,In-person,Communication skills,Python,Life insurance,On-site parking",
    "Extended health care,Permanent,Overtime,Weekends as needed,Overtime pay,Full-time,English,Dental care,Programmable logic controllers,Travel,French not required,System development,Company events,Vision care,Monday to Friday,In-person,Leadership,Communication skills,Mechanical knowledge,Life insurance,Time management",
    "Permanent,Computer Science,Engineering,Master's degree,Analysis skills,C++,Bachelor's,Software development,Linux,Electrical Engineering,Communication skills,Python",
    "Lucene,Kubernetes,Data structures,Full-time,Remote,Java,Bachelor's,Machine learning,Scala,APIs,Apache,On call,Python",
    "Computer science,Extended health care,Go,Doctoral degree,Computer Science,Kubernetes,System design,Full-time,Google Cloud Platform,Java,AWS,Docker,Bachelor's,Machine learning,Paid time off,Distributed systems,No university degree,Software development,Agile,Leadership,Python",
    "Operating systems,Doctoral degree,Computer Science,Engineering,Data structures,C#,Full-time,Java,Master's degree,C++,C,Bachelor's,JavaScript,Electrical Engineering,AI,TypeScript,Python",
    "Computer science,CSS,Full-time,OOP,Analysis skills,JavaScript,Angular,UX,Software development,Agile,HTML5",
    "Temporary,8 hour shift,NumPy,Full-time,Test-driven development,Pandas,OOP,Django,Agile,In-person,Fixed term contract,Flask,Python",
    "Casual dress,Temporary,8 hour shift,Salesforce Marketing Cloud,Salesforce,SQL,REST,Hybrid work,APIs,Monday to Friday,Fixed term contract,Marketing",
    "Jira,Kotlin,Computer Science,JUnit,DevOps,Mobile applications,Git,Remote,Android,Java,Product development,Scrum,Contracts,Agile,Unit testing,Android development,Design patterns",
    "Commission pay,Data structures,Post-secondary education,Full-time,Test-driven development,Analysis skills,Tuition reimbursement,Release management,Integration testing,Business requirements,Business,Communication skills,Life insurance",
    "Casual dress,Computer science,Extended health care,Wellness program,8 hour shift,Computer Science,React,Full-stack development,Data structures,Supply chain,Logistics,Full-time,Disability insurance,MongoDB,Master's degree,SOAP,Dental care,AWS,Docker,Bachelor's,Paid time off,Continuous improvement,JavaScript,REST,APIs,Company events,Vision care,Monday to Friday,In-person,Freight,Flask,TypeScript,Flexible schedule,Python,React Native,Life insurance",
    "Adobe Photoshop,Cover letter,Microsoft Excel,Adobe Lightroom,WordPress,Writing skills,Full-time,Microsoft Office,E-commerce,UX,Food industry,UI,Adobe InDesign,Communication skills,Marketing",
    "Full-time,Remote,SOAP,APIs,Adobe Marketing,Adobe Campaign",
    "Computer Science,React,D3.js,Web development,Full-time,Java,Master's degree,C++,Bachelor's,Angular,APIs,Unit testing,Data visualization,Python",
    "Computer science,Computer Science,Kubernetes,DevOps,English,Java,Docker,Bachelor's,Product development,JavaScript,Angular,Agile,UI,Internship / Co-op,Jenkins,GitLab,Communication skills,Python,HTML5",
    "Permanent,Customer service,Organizational skills,Monday to Friday",
    "Bar,Full-time,Every Weekend,Bistro,Restaurant",
    "8 hour shift,Overtime,Part-time,Weekends as needed,Overtime pay,Customer service,Food Handler Certification,Barista experience,Full-time,High school diploma or GED,Business development,Project management,Paid time off,Food service,Tips,French not required,Day shift,Monday to Friday,In-person,Communication skills",
    "Part-time,FoodSafe,Full-time,Evening shift,Every Weekend,Day shift,Monday to Friday,In-person,On call,Communication skills",
    "Hospitality,Part-time,Barista experience",
    "Part-time,Customer service,Basic math,Barista experience,Presentation skills,Evening shift,Every Weekend,Tips,Monday to Friday,In-person,Food safety,Cash handling,Communication skills,Time management",
    "Part-time,Weekends as needed,Sales,Presentation skills,Communication skills,Retail sales",
    "Part-time,Weekends as needed,No experience needed",
    "Part-time,Evenings as needed,Evening shift,Every Weekend,Monday to Friday,Flexible schedule",
    "Part-time",
    "Part-time,Customer service,Food Handler Certification,Cooking,Food service,Employee assistance program,Communication skills,Time management",
    "Weekends as needed,Customer service,No experience needed,Tuition reimbursement,Paid time off,Holidays",
    "Hospitality,Part-time,Barista experience,Communication skills"]

test.forEach(a => {
    getSkills(a.split(","))
})