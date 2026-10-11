import type { ResumeSnapshot } from '../export/ResumePdfDocument'
import type { ResumeTemplateId } from './registry'

/** Fictional, clearly labeled gallery candidate; never written into the user's editor. */
export const sampleResume: ResumeSnapshot = {
 inputValue: {
  fullName: 'Alex Morgan',
  label: 'Operations & Customer Experience Specialist',
  email: 'alex.morgan@example.com',
  phone: '+1 555 010 2040',
  city: 'Chicago',
  country: 'United States',
  linkdlnUrl: 'https://linkedin.com/in/alexmorgan-example',
  summary: 'Operations specialist with six years of experience coordinating service workflows, maintaining accurate records, and supporting cross-functional teams. Experienced in inventory management, customer escalation handling, and process documentation.',
 },
 fields: {
  experience: [
   { companyName:'Northstar Distribution (Fictional)',jobPosition:'Operations Coordinator',jobStartDate:'2022',jobEndDate:'Present',jobSummary:'Coordinate shipping schedules and maintain inventory documentation across warehouse and customer service teams.' },
   { companyName:'Greenline Retail (Fictional)',jobPosition:'Customer Service Associate',jobStartDate:'2019',jobEndDate:'2022',jobSummary:'Supported customers with product questions, exchanges, and order tracking while assisting with daily store operations.' },
  ],
  education:[{institution:'Lakeview State College (Fictional)',studyType:'Bachelor of Science',area:'Business Administration',startDate:'2015',endDate:'2019'}],
  skills:[{skillName:'Operations'},{skillName:'Software'},{skillName:'Customer experience'}],
  projects:[{name:'Inventory Process Documentation',description:'Created a consolidated reference guide for stock intake, order exceptions, and handovers between teams.'}],
  certificates:[{certificateName:'Foundations of Project Coordination (Sample)',certificateIssuer:'Fictional Training Institute',certificateDate:'2023'}],
  awards:[],
 },
 tagFields:{
  'jobHighlights-0':{tags:[
   'Maintained dispatch records and organized delivery updates for operations and customer teams.',
   'Documented recurring order exceptions to support consistent follow-up between shifts.',
   'Coordinated shipment schedules and escalated delivery delays to relevant stakeholders.',
  ]},
  'jobHighlights-1':{tags:[
   'Responded to customer inquiries about products, purchases, and returns.',
   'Maintained order records and helped resolve delivery questions with store colleagues.',
  ]},
  'skills-0':{tags:['Inventory tracking','Scheduling','Process documentation']},
  'skills-1':{tags:['Excel','Google Workspace','Customer support software']},
  'skills-2':{tags:['Issue resolution','Customer communication','Cross-team collaboration']},
  'projectHighlights-0':{tags:['Organized documented procedures around common retail order exceptions.']},
 },
}

/** Graduate example prioritizes education and verifiable hands-on projects. */
export const graduateSample: ResumeSnapshot = {
 inputValue: {
  fullName: 'Jamie Rivera',label: 'Graduate Software Developer',
  email:'jamie.rivera@example.com',phone:'+1 555 010 1040',
  city:'Austin',country:'United States',
  summary:'Computer science graduate with hands-on experience developing accessible web applications, building REST APIs, and testing project functionality through coursework and an internship.',
 },
 fields:{
  education:[{institution:'Riverside University (Fictional)',studyType:'Bachelor of Science',area:'Computer Science',startDate:'2022',endDate:'2026'}],
  projects:[
   {name:'Community Volunteer Portal',description:'Built a React and Node.js portal for volunteers to browse event schedules and register interest.'},
   {name:'Personal Budget Tracker',description:'Developed a browser-based budget tracker with expense categories and local data storage.'},
  ],
  skills:[{skillName:'Development'},{skillName:'Collaboration'}],
  experience:[{companyName:'Bluebird Software (Fictional)',jobPosition:'Software Development Intern',jobStartDate:'2025',jobEndDate:'2025',jobSummary:'Assisted the development team with UI testing, bug fixes, and documentation.'}],
  certificates:[],awards:[],
 },
 tagFields:{
  'skills-0':{tags:['TypeScript','React','Node.js','SQL','Git']},
  'skills-1':{tags:['Code reviews','Technical documentation','Cross-team communication']},
  'projectHighlights-0':{tags:['Created registration forms and error states for event sign-ups.','Documented API routes and ran manual usability checks.']},
  'projectHighlights-1':{tags:['Implemented expense categories, filters, and monthly summaries.']},
  'jobHighlights-0':{tags:['Verified UI fixes across desktop and mobile layouts.','Documented recurring test issues for the engineering team.']},
 },
}

/** Fictional leadership career; metrics are examples, not user-generated claims. */
export const leadershipSample: ResumeSnapshot = {
 inputValue:{
  fullName:'Amara Bennett',label:'Director of Operations',
  email:'amara.bennett@example.com',phone:'+1 555 010 3090',
  city:'New York',country:'United States',
  summary:'Operations leader with 12 years of experience managing regional service delivery, improving execution workflows, and leading cross-functional teams. Experienced in operational planning, supplier partnerships, performance reviews, and scaling internal processes.',
 },
 fields:{
  experience:[
   {companyName:'Summit Group (Fictional)',jobPosition:'Director of Operations',jobStartDate:'2021',jobEndDate:'Present',jobSummary:'Oversaw regional operations planning, service standards, and quarterly performance reviews across multiple departments.'},
   {companyName:'Harbor Logistics (Fictional)',jobPosition:'Operations Manager',jobStartDate:'2017',jobEndDate:'2021',jobSummary:'Coordinated staffing, vendor communications, and delivery planning with finance and service teams.'},
   {companyName:'Cedar Services (Fictional)',jobPosition:'Team Supervisor',jobStartDate:'2013',jobEndDate:'2017',jobSummary:'Supervised scheduling and daily service activities while supporting team training.'},
  ],
  education:[{institution:'North Shore University (Fictional)',studyType:'Master of Business Administration',area:'Operations',startDate:'2016',endDate:'2018'}],
  skills:[{skillName:'Leadership'},{skillName:'Operations'}],
  projects:[{name:'Regional Process Standardization',description:'Led a cross-functional project documenting handoffs and operating procedures for regional teams.'}],
  certificates:[{certificateName:'Operations Management Program (Sample)',certificateIssuer:'Fictional Leadership Institute',certificateDate:'2020'}],
  awards:[],
 },
 tagFields:{
  'jobHighlights-0':{tags:['Established regular performance reviews for regional service delivery.','Coordinated process updates across operations, finance, and customer-facing teams.']},
  'jobHighlights-1':{tags:['Managed vendor communications and weekly delivery planning.','Supported onboarding and training for new operations coordinators.']},
  'jobHighlights-2':{tags:['Supervised daily staffing schedules and escalated operational issues.']},
  'skills-0':{tags:['Team leadership','Stakeholder alignment','Operational planning']},
  'skills-1':{tags:['Service delivery','Process improvement','Supplier coordination']},
  'projectHighlights-0':{tags:['Documented key process decisions and responsibilities for team handovers.']},
 },
}

/** The gallery never writes samples to the real editor or PDF export state. */
export function sampleForTemplate(id: ResumeTemplateId): ResumeSnapshot {
 return id==='classic'?graduateSample:id==='executive'?leadershipSample:sampleResume
}
