import React from 'react'
import resumeData from '../resume.json'
// import './resume.css' // letter if you prefer moving styles to a CSS file

const ResumeComponent: React.FC = () => {
  const {
    basics,
    work,
    education,
    skills,
    projects,
    languages,
    volunteer,
    awards,
    certificates,
    publications,
    interests,
    references,
  } = resumeData

  const styles = {
    page: {
      width: '70vw',
      height: '1123px',
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
      color: '#2c5530',
      marginBottom: '5px',
    },
    label: {
      fontSize: '14px',
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
    },
    section: {
      marginBottom: '10px',
    },
    sectionTitle: {
      fontSize: '12px',
      fontWeight: 'bold' as const,
      color: '#2c5530',
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
    position: { fontSize: '10px', color: '#4a4a4a' },
    date: { fontSize: '9px', color: '#666666' },
    jobSummary: {
      fontSize: '9px',
      color: '#333333',
      textAlign: 'justify' as const,
    },
    educationItem: { marginBottom: '8px' },
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
        <div style={styles.name}>{basics.name}</div>
        <div style={styles.label}>{basics.label}</div>
        <div style={styles.contactInfo}>
          <span style={styles.contactItem}>{basics.email}</span>
          <span style={styles.contactItem}>{basics.phone}</span>
          <span style={styles.contactItem}>
            {basics.location.city}, {basics.location.region}
          </span>
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
      {basics.summary && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Summary</div>
          <div style={styles.jobSummary}>{basics.summary}</div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Skills</div>
          {skills.map((skill, index) => (
            <div key={index} style={styles.skillItem}>
              <div style={styles.skillName}>{skill.name}</div>
              {skill.level && (
                <div style={styles.skillLevel}>
                  Level:{' '}
                  <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                    {skill.level}
                  </span>
                </div>
              )}
              {skill.keywords.length > 0 && (
                <div style={styles.skillLevel}>
                  Technologies:
                  <span style={{ fontWeight: 'bold', color: '#3a3a3a' }}>
                    {' '}
                    {skill.keywords.join(', ')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Work Experience */}
      {work.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Work Experience</div>
          {work.map((job, index) => (
            <div key={index} style={styles.jobItem}>
              <div style={styles.jobHeader}>
                <div>
                  <div style={styles.company}>{job.name}</div>
                  <div style={styles.position}>{job.position}</div>
                </div>
                <div style={styles.date}>
                  {job.startDate} - {job.endDate || 'Present'}
                </div>
              </div>
              <div style={styles.jobSummary}>{job.summary}</div>
            </div>
          ))}
        </div>
      )}

      {/* Volunteer */}
      {volunteer.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Volunteer</div>
          {volunteer.map((vol, index) => (
            <div key={index} style={styles.jobItem}>
              <div style={styles.jobHeader}>
                <div>
                  <div style={styles.company}>{vol.organization}</div>
                  <div style={styles.position}>{vol.position}</div>
                </div>
                <div style={styles.date}>
                  {vol.startDate} - {vol.endDate || 'Present'}
                </div>
              </div>
              <div style={styles.jobSummary}>{vol.summary}</div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Education</div>
          {education.map((edu, index) => (
            <div key={index} style={styles.educationItem}>
              <div style={styles.institution}>{edu.institution}</div>
              <div style={styles.studyType}>
                {edu.studyType} in {edu.area}
              </div>
              <div style={styles.date}>
                {edu.startDate} - {edu.endDate || 'Present'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Projects</div>
          {projects.map((project, index) => (
            <div key={index} style={styles.projectItem}>
              <div style={styles.projectName}>{project.name}</div>
              <div style={styles.projectDescription}>{project.description}</div>
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

      {/* Awards */}
      {awards.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Awards</div>
          {awards.map((award, index) => (
            <div key={index} style={styles.educationItem}>
              <div style={styles.institution}>{award.title}</div>
              <div style={styles.studyType}>
                {award.awarder} — {award.date}
              </div>
              <div style={styles.jobSummary}>{award.summary}</div>
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Certificates</div>
          {certificates.map((cert, index) => (
            <div key={index} style={styles.educationItem}>
              <div style={styles.institution}>{cert.name}</div>
              <div style={styles.studyType}>
                {cert.issuer} — {cert.date}
              </div>
              {cert.url && (
                <a
                  style={styles.contactItem}
                  href={cert.url}
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

      {/* Publications */}
      {publications.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Publications</div>
          {publications.map((pub, index) => (
            <div key={index} style={styles.educationItem}>
              <div style={styles.institution}>{pub.name}</div>
              <div style={styles.studyType}>
                {pub.publisher} — {pub.releaseDate}
              </div>
              <div style={styles.jobSummary}>{pub.summary}</div>
              {pub.url && (
                <a
                  style={styles.contactItem}
                  href={pub.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Publication
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Languages</div>
          {languages.map((lang, index) => (
            <div key={index} style={styles.languageItem}>
              {lang.language}: {lang.fluency}
            </div>
          ))}
        </div>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Interests</div>
          {interests.map((int, index) => (
            <div key={index} style={styles.languageItem}>
              {int.name}: {int.keywords.join(', ')}
            </div>
          ))}
        </div>
      )}

      {/* References */}
      {references.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>References</div>
          {references.map((ref, index) => (
            <div key={index} style={styles.languageItem}>
              {ref.name}: {ref.reference}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResumeComponent
