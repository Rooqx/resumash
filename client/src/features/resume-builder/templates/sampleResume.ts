import type { ResumeSnapshot } from '../export/ResumePdfDocument'

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
