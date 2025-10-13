import React from 'react'
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import resumeData from '../resume.json'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1pt solid #2c5530',
    paddingBottom: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#4a4a4a',
    marginBottom: 8,
    fontFamily: 'Helvetica',
    marginTop: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 5,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: -2,
  },
  contactItem: {
    fontSize: 9,
    color: '#666666',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 2,
    textTransform: 'uppercase',

    paddingBottom: 3,
  },
  jobItem: {
    marginBottom: 10,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  company: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  position: {
    fontSize: 10,
    color: '#4a4a4a',
  },
  date: {
    fontSize: 9,
    color: '#666666',
  },
  jobSummary: {
    fontSize: 9,
    color: '#333333',
    textAlign: 'justify',
  },
  educationItem: {
    marginBottom: 8,
  },
  institution: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  studyType: {
    fontSize: 9,
    color: '#4a4a4a',
  },
  skillItem: {
    marginBottom: 5,
  },
  skillName: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  skillLevel: {
    fontSize: 8,
    color: '#666666',
    fontWeight: 'bold',
  },
  projectItem: {
    marginBottom: 8,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 9,
    color: '#333333',
    textAlign: 'justify',
  },
  languageItem: {
    fontSize: 9,
    marginBottom: 2,
  },
})
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

const ResumePDF = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{basics.name}</Text>
          <Text style={styles.label}>{basics.label}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>{basics.email}</Text>
            <Text style={styles.contactItem}>{basics.phone}</Text>
            <Text style={styles.contactItem}>
              {basics.location.city}, {basics.location.region}
            </Text>
            {basics.url && (
              <Link style={styles.contactItem} src={basics.url}>
                Portfolio
              </Link>
            )}
          </View>
        </View>

        {/* Summary */}
        {basics.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.jobSummary}>{basics.summary}</Text>
          </View>
        )}
        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <Text style={styles.skillName}>{skill.name}</Text>
                {skill.level && (
                  <Text style={styles.skillLevel}>
                    Level:{' '}
                    <Text style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                      {skill.level}
                    </Text>
                  </Text>
                )}
                {skill.keywords.length > 0 && (
                  <Text style={styles.skillLevel}>
                    Technologies:
                    <Text style={{ fontWeight: 'bold', color: '#3a3a3a' }}>
                      {' '}
                      {skill.keywords.join(', ')}
                    </Text>
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
        {/* Work Experience */}
        {work.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {work.map((job, index) => (
              <View key={index} style={styles.jobItem}>
                <View style={styles.jobHeader}>
                  <View>
                    <Text style={styles.company}>{job.name}</Text>
                    <Text style={styles.position}>{job.position}</Text>
                  </View>
                  <Text style={styles.date}>
                    {job.startDate} - {job.endDate || 'Present'}
                  </Text>
                </View>
                <Text style={styles.jobSummary}>{job.summary}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Volunteer */}
        {volunteer.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Volunteer</Text>
            {volunteer.map((vol, index) => (
              <View key={index} style={styles.jobItem}>
                <View style={styles.jobHeader}>
                  <View>
                    <Text style={styles.company}>{vol.organization}</Text>
                    <Text style={styles.position}>{vol.position}</Text>
                  </View>
                  <Text style={styles.date}>
                    {vol.startDate} - {vol.endDate || 'Present'}
                  </Text>
                </View>
                <Text style={styles.jobSummary}>{vol.summary}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.institution}>{edu.institution}</Text>
                <Text style={styles.studyType}>
                  {edu.studyType} in {edu.area}
                </Text>
                <Text style={styles.date}>
                  {edu.startDate} - {edu.endDate || 'Present'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectDescription}>
                  {project.description}
                </Text>
                {project.url && (
                  <Link style={styles.contactItem} src={project.url}>
                    View Project
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards</Text>
            {awards.map((award, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.institution}>{award.title}</Text>
                <Text style={styles.studyType}>
                  {award.awarder} — {award.date}
                </Text>
                <Text style={styles.jobSummary}>{award.summary}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certificates</Text>
            {certificates.map((cert, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.institution}>{cert.name}</Text>
                <Text style={styles.studyType}>
                  {cert.issuer} — {cert.date}
                </Text>
                {cert.url && (
                  <Link style={styles.contactItem} src={cert.url}>
                    View Certificate
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Publications */}
        {publications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publications</Text>
            {publications.map((pub, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.institution}>{pub.name}</Text>
                <Text style={styles.studyType}>
                  {pub.publisher} — {pub.releaseDate}
                </Text>
                <Text style={styles.jobSummary}>{pub.summary}</Text>
                {pub.url && (
                  <Link style={styles.contactItem} src={pub.url}>
                    View Publication
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {languages.map((lang, index) => (
              <Text key={index} style={styles.languageItem}>
                {lang.language}: {lang.fluency}
              </Text>
            ))}
          </View>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            {interests.map((int, index) => (
              <Text key={index} style={styles.languageItem}>
                {int.name}: {int.keywords.join(', ')}
              </Text>
            ))}
          </View>
        )}

        {/* References */}
        {references.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>References</Text>
            {references.map((ref, index) => (
              <Text key={index} style={styles.languageItem}>
                {ref.name}: {ref.reference}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}

export default ResumePDF
