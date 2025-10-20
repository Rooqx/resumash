import React from 'react'
import { Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import email from '../../../public/icons/mail.png'
import github from '../../../public/icons/github.png'
import mapPin from '../../../public/icons/map-pin.png'
import phone from '../../../public/icons/phone.png'
import linkdln from '../../../public/icons/linkedin.png'
import portfolio from '../../../public/icons/briefcase-business.png'
import resumeData from '@/components/resume.json'
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
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
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
    marginBottom: -8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
    fontSize: 9,
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
    lineHeight: 1.2,
  },

  jobHighlights: {
    fontSize: 9,
    color: '#333333',
    textAlign: 'justify',
    marginTop: 5,
  },

  educationItem: { marginBottom: 8 },

  institution: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  studyType: { fontSize: 9, color: '#4a4a4a' },

  skillItem: { marginBottom: 2 },

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

  projectItem: { lineHeight: 0.65, marginBottom: 8 },

  projectName: {
    fontSize: 9,
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
  // const { inputValue, fields, tagFields } = resumeData
  const { inputValue } = useInputStore()
  const { fields } = useFieldStores()
  const tagFields = useTagStore((s) => s.fields)

  console.log('Tag Fields:', tagFields)
  console.log('Fields:', fields)
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{inputValue.fullName || 'Full Name'}</Text>
        <Text style={styles.label}>
          {inputValue.label || 'Job Title (e.g Frontend Engineer)'}
        </Text>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Image
              src={email}
              style={{ width: 10, height: 10, marginRight: 3 }}
            />
            <Text>{inputValue.email || 'email@example.com'}</Text>
          </View>
          <View style={styles.contactItem}>
            <Image
              src={phone}
              style={{ width: 10, height: 10, marginRight: 3 }}
            />
            <Text>{inputValue.phone || '(123) 456-7890'}</Text>
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
                src={linkdln}
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
            src={inputValue.githubUrl || '#'}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Image
                src={github}
                style={{ width: 10, height: 10, marginRight: 5 }}
              />
              <Text>GitHub</Text>
            </View>
          </Link>
          {(inputValue.city || inputValue.country) && (
            <View style={styles.contactItem}>
              <Image
                src={mapPin}
                style={{ width: 10, height: 10, marginRight: 3 }}
              />
              <Text>
                {' '}
                {inputValue.city || 'City'}, {inputValue.country || 'Country'}
              </Text>
            </View>
          )}
          {inputValue.portfolioUrl && (
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
                  src={portfolio}
                  style={{ width: 10, height: 10, marginRight: 5 }}
                />
                <Text>Portfolio</Text>
              </View>
            </Link>
          )}
        </View>
      </View>
      {/* Summary */}
      {inputValue.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.jobSummary}>{inputValue.summary}</Text>
        </View>
      )}
      {/* Skills */}
      {fields['skills']?.length > 0 && (
        <View style={{ ...styles.section }}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {fields['skills'].map((field, index) => (
            <View key={index} style={{ lineHeight: 0.75, ...styles.skillItem }}>
              <Text style={styles.skillName}>
                {field.skillName || 'Skill Name'}
              </Text>
              <Text style={styles.skillLevel}>
                Technologies:{' '}
                {((tagFields as any)[`skills-${index}`]?.tags?.length ?? 0) > 0
                  ? (tagFields as any)[`skills-${index}`].tags.join(', ')
                  : 'No technologies added'}
              </Text>
            </View>
          ))}
        </View>
      )}
      {/* Work Experience */}
      {fields['experience']?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {fields['experience'].map((job, index) => (
            <View key={index} style={styles.jobItem}>
              <View style={styles.jobHeader}>
                <View>
                  <Text style={styles.company}>
                    {job.companyName || 'Company Name'}
                  </Text>
                  <Text style={styles.position}>
                    {job.jobPosition || 'Job Position'}
                  </Text>
                </View>
                <Text style={styles.date}>
                  {job.jobStartDate || 'Start Date'} -{' '}
                  {job.jobEndDate || 'Present'}
                </Text>
              </View>

              {job.jobSummary && (
                <Text style={styles.jobSummary}>{job.jobSummary}</Text>
              )}

              {(tagFields as any)[`jobHighlights-${index}`]?.tags?.length >
                0 && (
                <View style={styles.jobHighlights}>
                  {(tagFields as any)[`jobHighlights-${index}`].tags.map(
                    (item: string, i: number) => (
                      <Text key={i}>• {item}</Text>
                    ),
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      {/* Education */}
      {fields['education']?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {fields['education'].map((edu, index) => (
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
                  {edu.institution || 'Institution Name'}
                </Text>
                <Text style={styles.studyType}>
                  {edu.studyType || 'Study Type'} in {edu.area || 'Area'}
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
      {fields['projects']?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {fields['projects'].map((project, index) => (
            <View key={index} style={styles.projectItem}>
              <Text style={styles.projectName}>
                {project.name || 'Project Name'}
              </Text>
              <Text style={styles.projectDescription}>
                {project.description || 'Project description'}{' '}
                {(project as any)[`projectTechnologies-${index}`]?.join(', ')}
              </Text>
              {project.url && (
                <Link
                  style={{ marginTop: 5, ...styles.contactItem }}
                  src={project.url}
                >
                  View Project
                </Link>
              )}
            </View>
          ))}
        </View>
      )}
      {/** #ToDO fix */}
      {/* Certificates */}
      {fields['certificates']?.length > 0 &&
        fields['certificates'].some(
          (f) => f.certificateName && f.certificateName.trim() !== '',
        ) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {fields['certificates'].map((certificate, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>
                  {certificate.certificateName}
                </Text>
                <Text style={styles.projectDescription}>
                  {certificate.certificateIssuer
                    ? `Issued by ${certificate.certificateIssuer} – `
                    : ''}
                  {certificate.certificateDate
                    ? `(${certificate.certificateDate})`
                    : ''}
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
      {fields['awards']?.length > 0 &&
        fields['awards'].some(
          (f: any) => f.awardTitle && f.awardTitle.trim() !== '',
        ) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards</Text>
            {fields['awards'].map((award: any, index: number) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>
                  {award.awardTitle || award.title}
                </Text>
                <Text style={styles.projectDescription}>
                  {award.awarder && `Awarded by ${award.awarder} – `}
                  {award.awardDate && `(${award.awardDate})`}
                </Text>
                {award.awardSummary && (
                  <Text style={styles.projectDescription}>
                    {award.awardSummary}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
    </Page>
  )
}

export default ResumePDF
