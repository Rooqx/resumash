import { useEffect } from 'react'
import resumeData from '@/components/resume.json'
import email from '/icons/mail.png'
import github from '/icons/github.png'
import mapPin from '/icons/map-pin.png'
import phone from '/icons/phone.png'
import linkdln from '/icons/linkedin.png'
import portfolio from '/icons/briefcase-business.png'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'
import './resume.css'

const ResumePDF = () => {
  const { inputValue, fields, tagFields } = resumeData
  /* const { inputValue } = useInputStore()
  const { fields } = useFieldStores()
  const tagFields = useTagStore((s) => s.fields)*/

  useEffect(() => {}, [inputValue, fields, tagFields])

  return (
    <main className="page">
      {/* Header */}
      <div className="header">
        <div className="name">{inputValue?.fullName || 'Full Name'}</div>
        <div className="label">
          {inputValue?.label || 'Job Title (e.g Frontend Engineer)'}
        </div>
        <div className="contactInfo">
          <div className="contactItem flex justify-center items-center gap-1">
            <img src={email} className="icon" />
            <div>{inputValue?.email || 'email@example.com'}</div>
          </div>
          <div className="contactItem flex items-center justify-center gap-1">
            <img src={phone} className="icon" />
            <div>{inputValue?.phone || '(123) 456-7890'}</div>
          </div>
          <a className="link contactItem" href={inputValue?.linkdlnUrl || '#'}>
            <div className="flex justify-center items-center gap-1">
              <img src={linkdln} className="icon" />
              <div>LinkedIn</div>
            </div>
          </a>
          <a className="link contactItem" href={inputValue?.githubUrl || '#'}>
            <div className="flex justify-center items-center">
              <img
                src={github}
                style={{ width: '10px', height: '10px', marginRight: '5px' }}
              />
              <div>GitHub</div>
            </div>
          </a>
          {(inputValue?.city || inputValue?.country) && (
            <div className="flex justify-center items-center contactItem">
              <img src={mapPin} className="icon" />
              <div className="contactInfo">
                {inputValue?.city || 'City'}, {inputValue?.country || 'Country'}
              </div>
            </div>
          )}
          {inputValue?.portfolioUrl && (
            <a
              className="link contactItem"
              href={inputValue?.portfolioUrl || '#'}
            >
              <div className="flex justify-center items-center">
                <img
                  src={portfolio}
                  style={{
                    width: '10px',
                    height: '10px',
                    marginRight: '5px',
                  }}
                />
                <div>Portfolio</div>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {inputValue?.summary && (
        <div className="section">
          <div className="sectionTitle">Summary</div>
          <div className="jobSummary">{inputValue?.summary}</div>
        </div>
      )}

      {/* Skills */}
      {fields['skills'] && fields['skills'].length > 0 && (
        <div className="section">
          <div className="sectionTitle">Skills</div>

          {fields['skills'].map((field, index) => (
            <div key={index} className="skillItem">
              <div className="skillName">
                {field.skillName || 'Skill Category'}
              </div>

              <div className="skillLevel">
                Technologies:{' '}
                {((tagFields as any)[`skills-${index}`]?.tags?.length ?? 0) >
                0 ? (
                  <span style={{ fontWeight: 'bold', color: '#3a3a3a' }}>
                    {(tagFields as any)[`skills-${index}`]?.tags?.join(', ')}
                  </span>
                ) : (
                  <span style={{ color: '#777' }}>No technologies added</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Work Experience */}
      {fields['experience']?.length > 0 && (
        <div className="section">
          <div className="sectionTitle">Work Experience</div>
          {fields['experience'].map((job: any, index: number) => (
            <div key={index} className="jobItem">
              <div className="jobHeader">
                <div className="">
                  <div className="company">
                    {job.companyName || 'Company Name'}
                  </div>
                  <div className="position">
                    {job.jobPosition || 'Job Position'}
                  </div>
                </div>
                <div className="date">
                  {job.jobStartDate || 'Start Date'} -{' '}
                  {job.jobEndDate || 'Present'}
                </div>
              </div>

              {job.jobSummary && (
                <div className="jobSummary">{job.jobSummary}</div>
              )}

              {(tagFields as any)[`jobHighlights-${index}`]?.tags?.length >
                0 && (
                <ul className="jobHighlights list-disc">
                  {(tagFields as any)[`jobHighlights-${index}`].tags.map(
                    (item: string, i: number) => (
                      <div key={i} className=" flex items-start">
                        <b className="text-lg ">•</b>
                        <div className="ml-2 mt-1 leading-5">{item}</div>
                      </div>
                    ),
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {fields['education']?.length > 0 && (
        <div className="section">
          <div className="sectionTitle">Education</div>
          {fields['education'].map((edu: any, index: number) => (
            <div
              key={index}
              className="educationItem"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <div>
                <div className="institution">
                  {edu.institution || 'Institution Name'}
                </div>
                <div className="studyType">
                  {edu.studyType || 'Study Type'} in {edu.area || 'Area'}
                </div>
              </div>
              <div>
                <div className="date">
                  {edu.startDate || 'Start'} - {edu.endDate || 'Present'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {fields['projects']?.length > 0 && (
        <div className="section">
          <div className="sectionTitle">Projects</div>
          {fields['projects'].map((project: any, index: number) => (
            <div key={index} className="projectItem">
              <div className="projectName">
                {project.name || 'Project Name'}
              </div>
              <div className="projectDescription">
                {project.description || 'Project description'}
                {project[`projectTechnologies-${index}`]?.join(', ')}
              </div>
              {project.url && (
                <a
                  className="contactItem"
                  href={project.url}
                  style={{ marginTop: '5px' }}
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {fields['certificates'] &&
        fields['certificates']?.length > 0 &&
        fields['certificates'].some(
          (f: any) => f.certificateName && f.certificateName.trim() !== '',
        ) && (
          <div className="section">
            <div className="sectionTitle">Certifications</div>
            {fields['certificates'].map((certificate: any, index: number) => (
              <div key={index} className="projectItem">
                <div className="projectName">{certificate.certificateName}</div>
                <div className="projectDescription">
                  {certificate.certificateIssuer
                    ? `Issued by ${certificate.certificateIssuer} – `
                    : ''}
                  {certificate.certificateDate
                    ? `(${certificate.certificateDate})`
                    : ''}
                </div>
                {certificate.certificateUrl && (
                  <a className="contactItem" href={certificate.certificateUrl}>
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Awards */}
      {fields['awards']?.length > 0 &&
        fields['awards'].some(
          (f: any) => f.awardTitle && f.awardTitle.trim() !== '',
        ) && (
          <div className="section">
            <div className="sectionTitle">Awards</div>
            {fields['awards'].map((award: any, index: number) => (
              <div key={index} className="projectItem">
                <div className="projectName">
                  {award.awardTitle || award.title}
                </div>
                <div className="projectDescription">
                  {award.awarder && `Awarded by ${award.awarder} – `}
                  {award.awardDate && `(${award.awardDate})`}
                </div>
                {award.awardSummary && (
                  <div className="projectDescription">{award.awardSummary}</div>
                )}
              </div>
            ))}
          </div>
        )}
    </main>
  )
}

export default ResumePDF
