import React from 'react'
import { Award, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import resumeData from '../resume.json'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'

const ResumeComponent: React.FC = () => {
  const {
    basics,
    work,
    education,
    skills,
    projects,

    certificates,
    /* volunteer,
    awards,
  languages,
    publications,
    interests,
    references,*/
  } = resumeData

  const { inputValue } = useInputStore()
  const { fields } = useFieldStores()

  const tagFields = useTagStore((s) => s.fields)
  console.log('field', fields)

  // Move this to a seperate file later
  const styles = {
    page: {
      width: '50vw',
      height: '800px',
      border: '1px solid black',
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#FFFFFF',
      padding: '30px',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '16px',
      lineHeight: '1.4',
      color: '#000',
    },
    header: {
      marginBottom: '20px',
      borderBottom: '1pt solid #2c5530',
      paddingBottom: '2px',
    },
    name: {
      fontSize: '24px',
      fontWeight: 'bold' as const,
      color: 'black',
      marginBottom: '5px',
    },
    label: {
      fontSize: '10px',
      color: '#4a4a4a',
      marginBottom: '8px',
      marginTop: '10px',
    },
    contactInfo: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: '5px',
      marginTop: '-2px',
    },
    contactItem: {
      fontSize: '9px',
      color: '#666666',
      display: 'flex',
      justifyContent: 'center',
      gap: '5px',
    },
    section: {
      marginBottom: '10px',
    },
    sectionTitle: {
      fontSize: '12px',
      fontWeight: 'bold' as const,
      color: 'black',
      marginBottom: '2px',
      textTransform: 'uppercase' as const,
      paddingBottom: '3px',
    },
    jobItem: { marginBottom: '10px' },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '3px',
    },
    company: { fontSize: '10px', fontWeight: 'bold' as const },
    position: {
      fontSize: '10px',
      color: '#3a3a3a',
      fontWeight: 'semibold' as const,
    },
    date: {
      fontSize: '9px',
      color: '#666666',
      minWidth: '110px',
    },
    jobSummary: {
      fontSize: '9px',
      color: '#333333',
      textAlign: 'justify' as const,
    },
    jobHighlights: {
      fontSize: '9px',
      color: '#333333',
      textAlign: 'justify' as const,
      marginTop: '5px',
    },
    educationItem: {
      marginBottom: '8px',
    },
    institution: {
      fontSize: '10px',
      fontWeight: 'bold' as const,
      marginBottom: '2px',
    },
    studyType: { fontSize: '9px', color: '#4a4a4a' },
    skillItem: { marginBottom: '5px' },
    skillName: {
      fontSize: '9px',
      fontWeight: 'bold' as const,
      marginBottom: '1px',
    },
    skillLevel: {
      fontSize: '8px',
      color: '#666666',
      fontWeight: 'bold' as const,
    },
    projectItem: { marginBottom: '8px' },
    projectName: {
      fontSize: '10px',
      fontWeight: 'bold' as const,
      marginBottom: '2px',
    },
    projectDescription: {
      fontSize: '9px',
      color: '#333333',
      textAlign: 'justify' as const,
    },
    languageItem: { fontSize: '9px', marginBottom: '2px' },
  }

  return (
    <div style={styles.page}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.name}>
          {inputValue.fullName || basics.name || 'Full Name'}
        </div>
        <div style={styles.label}>
          {inputValue.label ||
            basics.label ||
            'Job Title (e.g Frontend Engineer)'}
        </div>
        <div style={styles.contactInfo}>
          <span style={styles.contactItem}>
            <Mail size={10} />
            {inputValue.email || basics.email || 'email@example.com'}
          </span>
          <span style={styles.contactItem}>
            <Phone size={10} />
            {inputValue.phone || basics.phone || '(123) 456-7890'}
          </span>
          <a
            style={{ ...styles.contactItem, cursor: 'pointer' }}
            href={inputValue.linkdlnUrl || basics.profiles[0].url || '#'}
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin size={10} />
            {'LinkedIn'}
          </a>
          <a
            style={{ ...styles.contactItem, cursor: 'pointer' }}
            href={inputValue.githubUrl || basics.profiles[1].url || '#'}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={10} />
            {'GitHub'}
          </a>
          {(inputValue.city || inputValue.country || basics.location.city) && (
            <span style={styles.contactItem}>
              <MapPin size={10} />
              {inputValue.city || basics.location.city || 'City'},{' '}
              {inputValue.country || basics.location.countryCode || 'Country'}
            </span>
          )}
          {basics.url && (
            <a
              style={styles.contactItem}
              href={basics.url}
              target="_blank"
              rel="noreferrer"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {(inputValue.summary || basics.summary) && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Summary</div>
          <div style={styles.jobSummary}>
            {inputValue.summary || basics.summary}
          </div>
        </div>
      )}

      {/* Skills - Use fields array for skills data */}
      {fields.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Skills</div>

          {fields.map((field, index) => (
            <div key={index} style={styles.skillItem}>
              <div style={styles.skillName}>
                {field.skillName || 'Skill Name'}
              </div>

              <div style={styles.skillLevel}>
                Technologies:{' '}
                {(tagFields[`skills-${index}`]?.tags?.length ?? 0) > 0 && (
                  <span style={{ fontWeight: 'bold', color: '#3a3a3a' }}>
                    {tagFields[`skills-${index}`].tags.join(', ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Work Experience - Use fields array for work experience */}
      {(fields.length > 0 || work.length > 0) && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Work Experience</div>
          {(fields.length > 0 ? fields : work).map((job, index) => (
            <div key={index} style={styles.jobItem}>
              <div style={styles.jobHeader}>
                <div>
                  <div style={styles.company}>
                    {job.companyName || job.name || 'Company Name'}
                  </div>
                  <div style={styles.position}>
                    {/** Make text smaller */}
                    {job.jobPosition || job.position || 'Job Position'}
                  </div>
                </div>
                <div style={styles.date}>
                  {job.jobStartDate || 'Start Date'} -{' '}
                  {job.endDate || 'Present'}
                </div>
              </div>
              {/** Shift this closer */}
              {job.jobSummary && (
                <div style={styles.jobSummary}>{job.jobSummary}</div>
              )}
              {tagFields[`jobHighlights-${index}`] && (
                <div style={styles.jobHighlights}>
                  {Array.isArray(tagFields[`jobHighlights-${index}`].tags) ? (
                    tagFields[`jobHighlights-${index}`].tags.map(
                      (item: string, i: number) => <li key={i}>{item}</li>,
                    )
                  ) : (
                    <li>{job.highlights}</li>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education - Use fields array for education data */}
      {(fields.length > 0 || education.length > 0) && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Education</div>
          {(fields.length > 0 ? fields : education).map((edu, index) => (
            <div key={index} style={styles.educationItem}>
              <div style={styles.institution}>
                {edu.institution || edu.school || 'Institution Name'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={styles.studyType}>
                  {edu.studyType || edu.degree} in{' '}
                  {edu.area || edu.fieldOfStudy || 'Field of Study'}
                </div>
                <div style={styles.date}>
                  {edu.startDate || 'Start'} - {edu.endDate || 'Present'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects  sections */}
      {fields.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Projects</div>
          {fields.map((project, index) => (
            <div key={index} style={styles.projectItem}>
              <div style={styles.projectName}>
                {project.name || 'Project Name'}
              </div>
              <div style={styles.projectDescription}>
                {project.description || 'Project description'}{' '}
                {project[`projectTechnologies-${index}`]?.join(', ')}
              </div>
              {project.url && (
                <a
                  style={styles.contactItem}
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================== Certificates ================== */}
      {fields.length > 0 &&
        fields.some(
          (field) =>
            field.certificateName && field.certificateName.trim() !== '',
        ) && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Certifications</div>
            {fields.map((certificate, index) => (
              <div key={index} style={styles.projectItem}>
                <div style={styles.projectName}>
                  {certificate.certificateName || certificate.name}
                </div>
                <div style={styles.projectDescription}>
                  {certificate.certificateIssuer && (
                    <>Issued by {certificate.certificateIssuer} – </>
                  )}
                  {certificate.certificateDate && (
                    <>({certificate.certificateDate}) </>
                  )}
                </div>
                {certificate.certificateUrl && (
                  <a
                    style={styles.contactItem}
                    href={certificate.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

      {/* ================== Awards ================== */}
      {fields.length > 0 &&
        fields.some(
          (field) => field.awardTitle && field.awardTitle.trim() !== '',
        ) && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Awards</div>
            {fields.map((award, index) => (
              <div key={index} style={styles.projectItem}>
                <div style={styles.projectName}>
                  {award.awardTitle || award.title}
                </div>
                <div style={styles.projectDescription}>
                  {award.awarder && <>Awarded by {award.awarder} – </>}
                  {award.awardDate && <>({award.awardDate})</>}
                  {award.awardSummary && <div>{award.awardSummary}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

export default ResumeComponent
