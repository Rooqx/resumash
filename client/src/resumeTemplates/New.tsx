import React from 'react'
import {
  Document,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import resumeData from './resume.json'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#222',
    backgroundColor: '#fff',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#f4f2ff',
    padding: 22,
    borderRight: '1pt solid #e0d7ff',
  },
  main: {
    width: '70%',
    padding: 30,
    lineHeight: 1.5,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: 'center',
    marginBottom: 15,
    border: '2pt solid #8b5cf6',
  },
  name: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2e1065',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    color: '#6b21a8',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#5b21b6',
    textTransform: 'uppercase',
    borderBottom: '1px solid #d8b4fe',
    marginBottom: 6,
  },
  link: {
    color: '#7c3aed',
    textDecoration: 'none',
  },
  listItem: {
    marginLeft: 8,
    marginBottom: 3,
  },
  text: {
    marginBottom: 3,
  },
  subheading: {
    fontWeight: 'bold',
    fontSize: 11.5,
    color: '#2e1065',
    flexDirection: 'column',
  },
  smallText: {
    color: '#666',
    fontSize: 10.5,
  },
  sectionSpacing: {
    marginBottom: 12,
  },
})

export const ResumeDocument = ({ value }: { value?: string }) => {
  const { basics, work, education, skills, projects, languages } = resumeData

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* LEFT SIDEBAR */}
        <View style={styles.sidebar}>
          {basics.image && <Image src={basics.image} style={styles.image} />}
          <Text style={styles.name}>{value || basics.name}</Text>
          <Text style={styles.label}>{basics.label}</Text>

          {/* Contact Info */}
          <View
            style={{
              fontSize: 12,
              fontFamily: 'Helvetica',
              marginTop: 15,
              lineHeight: 1,
            }}
          >
            <Text
              style={{
                flexDirection: 'row',
                flexWrap: 'nowrap',
              }}
            >
              Email: {basics.email}
            </Text>
            <Text
              style={{
                flexDirection: 'row',
                flexWrap: 'nowrap',
              }}
            >
              Phone: {basics.phone}
            </Text>
            {basics.url && (
              <Link src={basics.url} style={styles.link}>
                Portfolio
              </Link>
            )}
          </View>

          {/* Profiles */}
          {basics.profiles.length > 0 && (
            <View style={{ marginTop: 18 }}>
              <Text style={styles.sectionTitle}>Profiles</Text>
              {basics.profiles.map((p, i) => (
                <Link key={i} src={p.url} style={styles.link}>
                  {p.network}: {p.username}
                </Link>
              ))}
            </View>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <View style={{ marginTop: 18 }}>
              <Text style={styles.sectionTitle}>Skills</Text>
              {skills.map((s, i) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <View style={styles.subheading}>
                    <Text> {s.name}</Text>
                    <Text style={{ fontSize: 10, fontWeight: 'semibold' }}>
                      ({s.level})
                    </Text>
                  </View>
                  {s.keywords.map((k, j) => (
                    <Text key={j} style={styles.listItem}>
                      • {k}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.main}>
          {/* Summary */}
          {basics.summary && (
            <View style={styles.sectionSpacing}>
              <Text style={styles.sectionTitle}>Profile Summary</Text>
              <Text>{basics.summary}</Text>
            </View>
          )}

          {/* Work Experience */}
          {work.length > 0 && (
            <View style={styles.sectionSpacing}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {work.map((job, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={styles.subheading}>
                    {job.position} — {job.name}
                  </Text>
                  <Text style={styles.smallText}>
                    {job.startDate} - {job.endDate || 'Present'}
                  </Text>
                  <Text>{job.summary}</Text>
                  {job.highlights.map((h, j) => (
                    <Text key={j} style={styles.listItem}>
                      • {h}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View style={styles.sectionSpacing}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {projects.map((proj, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={styles.subheading}>{proj.name}</Text>
                  <Text>{proj.description}</Text>
                  {proj.highlights?.map((h, j) => (
                    <Text key={j} style={styles.listItem}>
                      • {h}
                    </Text>
                  ))}
                  {proj.url && (
                    <Link src={proj.url} style={styles.link}>
                      {proj.url}
                    </Link>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={styles.sectionSpacing}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={styles.subheading}>{edu.institution}</Text>
                  <Text>
                    {edu.studyType} in {edu.area}
                  </Text>
                  <Text style={styles.smallText}>
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <View style={styles.sectionSpacing}>
              <Text style={styles.sectionTitle}>Languages</Text>
              {languages.map((lang, i) => (
                <Text key={i}>
                  {lang.language} — {lang.fluency}
                </Text>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
