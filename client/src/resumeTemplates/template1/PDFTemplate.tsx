import React from 'react'
import { Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

import resumeData from '../resume.json'
import useInputStore from '@/lib/stores/useInputStores'
import useFieldStores from '@/lib/stores/useMultipleFieldStore'
import { useTagStore } from '@/lib/stores/useInputTags'

// ====================== Styles ======================
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 16,
    lineHeight: 1,
    color: '#000',
    flexDirection: 'column',
  },

  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2c5530',
    borderBottomStyle: 'solid',
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },

  label: {
    fontSize: 10,
    color: '#4a4a4a',
    marginBottom: 8,
    marginTop: 10,
  },

  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: -1,
  },
  link: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    marginRight: 5,
    marginBottom: 3,
  },
  contactItem: {
    fontSize: 9,
    color: '#666666',
    marginRight: 5,
    marginBottom: 3,
    display: 'flex',
    flexDirection: 'row',
  },

  section: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
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

  company: { fontSize: 10, fontWeight: 'bold' },

  position: {
    fontSize: 10,
    color: '#3a3a3a',
    fontWeight: 'bold', // changed from semibold (unsupported)
  },

  date: {
    fontSize: 9,
    color: '#666666',
    minWidth: 110,
  },

  jobSummary: {
    fontSize: 9,
    color: '#333333',
    textAlign: 'justify',
  },

  jobHighlights: {
    fontSize: 9,
    color: '#333333',
    textAlign: 'justify',
    marginTop: 5,
  },

  educationItem: { marginBottom: 8 },

  institution: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  studyType: { fontSize: 9, color: '#4a4a4a' },

  skillItem: { marginBottom: 5 },

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

  projectItem: { marginBottom: 8 },

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

  languageItem: { fontSize: 9, marginBottom: 2 },
})

const ResumePDF: React.FC = () => {
  const { basics, work, education, skills, projects, certificates } = resumeData
  const { inputValue } = useInputStore()
  const { fields } = useFieldStores()
  const tagFields = useTagStore((s) => s.fields)

  console.log('Tag Fields:', tagFields)
  console.log('Fields:', fields)
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>
          {inputValue.fullName || basics.name || 'Full Name'}
        </Text>
        <Text style={styles.label}>
          {inputValue.label ||
            basics.label ||
            'Job Title (e.g Frontend Engineer)'}
        </Text>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Image
              src="/icons/mail.png"
              style={{ width: 10, height: 10, marginRight: 3 }}
            />
            <Text>
              {inputValue.email || basics.email || 'email@example.com'}
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Image
              src="/icons/phone.png"
              style={{ width: 10, height: 10, marginRight: 3 }}
            />
            <Text>{inputValue.phone || basics.phone || '(123) 456-7890'}</Text>
          </View>
          <Link
            style={{
              textDecoration: 'none',
              ...styles.contactItem,
            }}
            src={inputValue.linkdlnUrl || '#'}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Image
                src="/icons/linkedin.png"
                style={{ width: 10, height: 10, marginRight: 3 }}
              />{' '}
              <Text>LinkedIn</Text>
            </View>
          </Link>
          <Link
            style={{
              textDecoration: 'none',
              ...styles.contactItem,
            }}
            src={inputValue.githubUrl || basics.profiles[1].url || '#'}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Image
                src="/icons/github.png"
                style={{ width: 10, height: 10, marginRight: 5 }}
              />
              <Text>GitHub</Text>
            </View>
          </Link>
          {(inputValue.city || inputValue.country || basics.location.city) && (
            <View style={styles.contactItem}>
              <Image
                src="/icons/map-pin.png"
                style={{ width: 10, height: 10, marginRight: 3 }}
              />
              <Text>
                {' '}
                {inputValue.city || basics.location.city || 'City'},{' '}
                {inputValue.country || basics.location.countryCode || 'Country'}
              </Text>
            </View>
          )}
          {basics.url && (
            <Link
              style={{
                textDecoration: 'none',
                ...styles.contactItem,
              }}
              src={inputValue?.portfolioUrl || '#'}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Image
                  src="/icons/briefcase-business.png"
                  style={{ width: 10, height: 10, marginRight: 5 }}
                />
                <Text>Portfolio</Text>
              </View>
              Portfolio
            </Link>
          )}
        </View>
      </View>

      {/* Summary */}
      {(inputValue.summary || basics.summary) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.jobSummary}>
            {inputValue.summary || basics.summary}
          </Text>
        </View>
      )}

      {/* Skills */}
      {fields.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {fields.map((field, index) => (
            <View key={index} style={styles.skillItem}>
              <Text style={styles.skillName}>
                {field.skillName || 'Skill Name'}
              </Text>
              <Text style={styles.skillLevel}>
                Technologies:{' '}
                {(tagFields[`skills-${index}`]?.tags?.length ?? 0) > 0
                  ? tagFields[`skills-${index}`].tags.join(', ')
                  : ''}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Work Experience */}
      {(fields.length > 0 || work.length > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {(fields.length > 0 ? fields : work).map((job, index) => (
            <View key={index} style={styles.jobItem}>
              <View style={styles.jobHeader}>
                <View>
                  <Text style={styles.company}>
                    {job.companyName || job.name || 'Company Name'}
                  </Text>
                  <Text style={styles.position}>
                    {job.jobPosition || job.position || 'Job Position'}
                  </Text>
                </View>
                <Text style={styles.date}>
                  {job.jobStartDate || 'Start Date'} -{' '}
                  {job.endDate || 'Present'}
                </Text>
              </View>
              {job.jobSummary && (
                <Text style={styles.jobSummary}>{job.jobSummary}</Text>
              )}
              {tagFields[`jobHighlights-${index}`] && (
                <View style={styles.jobHighlights}>
                  {Array.isArray(tagFields[`jobHighlights-${index}`].tags) ? (
                    tagFields[`jobHighlights-${index}`].tags.map(
                      (item: string, i: number) => (
                        <Text key={i}>• {item}</Text>
                      ),
                    )
                  ) : (
                    <Text>• {job.highlights}</Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {(fields.length > 0 || education.length > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {(fields.length > 0 ? fields : education).map((edu, index) => (
            <View
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                ...styles.educationItem,
              }}
            >
              <View>
                <Text style={styles.institution}>
                  {edu.institution || edu.school || 'Institution Name'}
                </Text>
                <Text style={styles.studyType}>
                  {edu.studyType || edu.degree} in{' '}
                  {edu.area || edu.fieldOfStudy || 'Field of Study'}
                </Text>
              </View>
              <View>
                <Text style={styles.date}>
                  {edu.startDate || 'Start'} - {edu.endDate || 'Present'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {fields.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {fields.map((project, index) => (
            <View key={index} style={styles.projectItem}>
              <Text style={styles.projectName}>
                {project.name || 'Project Name'}
              </Text>
              <Text style={styles.projectDescription}>
                {project.description || 'Project description'}{' '}
                {project[`projectTechnologies-${index}`]?.join(', ')}
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

      {/* Certificates */}
      {fields.length > 0 &&
        fields.some(
          (f) => f.certificateName && f.certificateName.trim() !== '',
        ) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {fields.map((certificate, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>
                  {certificate.certificateName || certificate.name}
                </Text>
                <Text style={styles.projectDescription}>
                  {certificate.certificateIssuer && (
                    <>Issued by {certificate.certificateIssuer} – </>
                  )}
                  {certificate.certificateDate && (
                    <>({certificate.certificateDate})</>
                  )}
                </Text>
                {certificate.certificateUrl && (
                  <Link
                    style={styles.contactItem}
                    src={certificate.certificateUrl}
                  >
                    View Certificate
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

      {/* Awards */}
      {fields.length > 0 &&
        fields.some((f) => f.awardTitle && f.awardTitle.trim() !== '') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards</Text>
            {fields.map((award, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>
                  {award.awardTitle || award.title}
                </Text>
                <Text style={styles.projectDescription}>
                  {award.awarder && `Awarded by ${award.awarder} – `}
                  {award.awardDate && `(${award.awardDate})`}
                </Text>
                {award.awardSummary && <Text>{award.awardSummary}</Text>}
              </View>
            ))}
          </View>
        )}
    </Page>
  )
}

export default ResumePDF
