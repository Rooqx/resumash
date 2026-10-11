import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { ReactNode } from 'react'
import type { ResumeTemplateId } from '../templates/registry'
import { orderedResumeSections, templateConfigs } from '../templates/templateConfig'

/**
 * Immutable snapshot of the current resume editor.
 *
 * inputValue: Simple candidate fields such as name, email, summary.
 * fields: Repeatable experience, education, skills and projects.
 * tagFields: Bullet lists associated with the corresponding field index.
 *
 * The same snapshot drives all three printable resume designs. No backend
 * request or DOM screenshot is required to generate the actual PDF.
 */
export interface ResumeSnapshot {
  inputValue: Record<string, string>
  fields: Record<string, Array<Record<string, unknown>>>
  tagFields: Record<string, { tags: string[] }>
}

interface ResumePdfDocumentProps {
  snapshot: ResumeSnapshot
  template: ResumeTemplateId
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 42,
    paddingHorizontal: 47,
    fontSize: 9.3,
    lineHeight: 1.42,
    color: '#1b1b1b',
    backgroundColor: '#fff',
  },
  classicPage: { fontFamily: 'Times-Roman', paddingTop: 35 },
  modernPage: { fontFamily: 'Helvetica', paddingTop: 45 },
  executivePage: { fontFamily: 'Times-Roman', paddingTop: 50 },
  header: { borderBottomWidth: 1, borderBottomColor: '#282828', paddingBottom: 10, marginBottom: 13 },
  classicHeader: { alignItems: 'flex-start', borderBottomWidth: 1.2, borderBottomColor: '#304752' },
  executiveHeader: { borderBottomWidth: 0, marginBottom: 19 },
  name: { fontSize: 21, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  classicName: { fontSize: 22, fontFamily: 'Times-Bold', color: '#203946' },
  executiveName: { fontSize: 28, fontFamily: 'Times-Roman', color: '#273024' },
  role: { fontSize: 10.5, marginBottom: 4 },
  contact: { fontSize: 8.5, color: '#434343' },
  section: { marginBottom: 12 },
  classicSection: { marginBottom: 10 },
  executiveSection: { marginBottom: 18 },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.1,
    marginBottom: 7,
    borderBottomColor: '#a5a5a5',
    borderBottomWidth: .55,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: .7,
  },
  classicSectionTitle: { fontFamily: 'Times-Bold', borderBottomColor: '#333' },
  executiveSectionTitle: { fontFamily: 'Times-Bold', borderBottomWidth: 0, letterSpacing: 1.3 },
  entry: { marginBottom: 8 },
  entryTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9.4, marginBottom: 2 },
  serifEntryTitle: { fontFamily: 'Times-Bold' },
  detail: { fontSize: 9.1, marginTop: 2, marginBottom: 1 },
  date: { fontSize: 8.4, color: '#4b4b4b', marginBottom: 2 },
  body: { fontSize: 9.1, marginTop: 2, lineHeight: 1.43 },
  bullet: { fontSize: 9.1, marginLeft: 11, marginTop: 2, lineHeight: 1.42 },
  skill: { fontSize: 9.1, marginBottom: 3 },
})

const text = (value: unknown): string => typeof value === 'string' ? value.trim() : ''
const join = (values: unknown[], separator = ' · '): string =>
  values.map(text).filter(Boolean).join(separator)

/** Gets existing editor entries without trusting the runtime shape. */
function entries(snapshot: ResumeSnapshot, section: string): Array<Record<string, unknown>> {
  const value = snapshot.fields[section]
  return Array.isArray(value)
    ? value.filter(entry => entry !== null && typeof entry === 'object' && !Array.isArray(entry))
    : []
}

function Section({
  title,
  template,
  children,
}: {
  title: string
  template: ResumeTemplateId
  children: ReactNode
}) {
  return (
    <View style={[
      styles.section,
      template === 'classic' ? styles.classicSection : {},
      template === 'executive' ? styles.executiveSection : {},
      {marginBottom:templateConfigs[template].sectionSpacing * 0.75},
    ]}>
      <Text style={[
        styles.sectionTitle,
        template === 'classic' ? styles.classicSectionTitle : {},
        template === 'executive' ? styles.executiveSectionTitle : {},
      ]}>{title}</Text>
      {children}
    </View>
  )
}

function Entry({
  title,
  subtitle,
  date,
  description,
  bullets = [],
  template,
}: {
  title: string
  subtitle?: string
  date?: string
  description?: string
  bullets?: string[]
  template: ResumeTemplateId
}) {
  return (
    <View style={styles.entry}>
      {!!title && <Text style={[styles.entryTitle, template === 'modern' ? {} : styles.serifEntryTitle]}>{title}</Text>}
      {!!subtitle && <Text style={styles.detail}>{subtitle}</Text>}
      {!!date && <Text style={styles.date}>{date}</Text>}
      {!!description && <Text style={styles.body}>{description}</Text>}
      {bullets.filter(Boolean).map((bullet, i) => (
        <Text key={i} style={styles.bullet}>• {bullet}</Text>
      ))}
    </View>
  )
}

/**
 * Selectable-text PDF renderer, not a screenshot of the editor.
 * React PDF automatically flows longer content across A4 pages.
 */
export default function ResumePdfDocument({ snapshot, template }: ResumePdfDocumentProps) {
  const basics = snapshot.inputValue
  const experienceEntries = entries(snapshot, 'experience')
  const educationEntries = entries(snapshot, 'education')
  const skillEntries = entries(snapshot, 'skills')
  const projectEntries = entries(snapshot, 'projects')
  const certificateEntries = entries(snapshot, 'certificates')
  const awardEntries = entries(snapshot, 'awards')

  const experience = experienceEntries.length > 0 && (
    <Section title="Professional Experience" template={template}>
      {experienceEntries.map((job, index) => (
        <Entry key={index} template={template}
          title={text(job.jobPosition) || text(job.companyName)}
          subtitle={text(job.companyName)}
          date={join([job.jobStartDate, job.jobEndDate || 'Present'], ' – ')}
          description={text(job.jobSummary)}
          bullets={snapshot.tagFields[`jobHighlights-${index}`]?.tags || []}
        />
      ))}
    </Section>
  )

  const education = educationEntries.length > 0 && (
    <Section title="Education" template={template}>
      {educationEntries.map((entry, index) => (
        <Entry key={index} template={template}
          title={text(entry.institution)}
          subtitle={join([entry.studyType, entry.area], ' in ')}
          date={join([entry.startDate, entry.endDate], ' – ')}
          description={text(entry.gpa) ? `GPA: ${text(entry.gpa)}` : ''}
        />
      ))}
    </Section>
  )

  const skills = skillEntries.length > 0 && (
    <Section title="Skills" template={template}>
      {skillEntries.map((entry, index) => (
        <Text style={styles.skill} key={index}>
          {text(entry.skillName)}{snapshot.tagFields[`skills-${index}`]?.tags?.length
            ? `: ${snapshot.tagFields[`skills-${index}`]?.tags.join(', ')}`
            : ''}
        </Text>
      ))}
    </Section>
  )

  const projects = projectEntries.length > 0 && (
    <Section title="Projects" template={template}>
      {projectEntries.map((entry, index) => (
        <Entry key={index} template={template}
          title={text(entry.name)}
          description={text(entry.description)}
          bullets={snapshot.tagFields[`projectHighlights-${index}`]?.tags || []}
        />
      ))}
    </Section>
  )

  const additional = (certificateEntries.length > 0 || awardEntries.length > 0) && (
    <Section title="Additional" template={template}>
      {certificateEntries.map((entry, i) => (
        <Entry key={`cert-${i}`} template={template}
          title={text(entry.certificateName)}
          subtitle={text(entry.certificateIssuer)}
          date={text(entry.certificateDate)}
        />
      ))}
      {awardEntries.map((entry, i) => (
        <Entry key={`award-${i}`} template={template}
          title={text(entry.awardTitle)}
          subtitle={text(entry.awarder)}
          date={text(entry.awardDate)}
          description={text(entry.awardSummary)}
        />
      ))}
    </Section>
  )

  const summary = !!text(basics.summary) && (
    <Section title={templateConfigs[template].summaryTitle} template={template}>
      <Text style={styles.body}>{text(basics.summary)}</Text>
    </Section>
  )

  const location = join([basics.city, basics.country], ', ')
  const contact = join([
    basics.email,
    basics.phone,
    location,
    basics.linkdlnUrl,
    basics.githubUrl,
    basics.portfolioUrl,
  ])

  return (
    <Document title={text(basics.fullName) ? `${basics.fullName} — Resume` : 'Resume'} creator="Resumash">
      <Page size="A4" wrap style={[
        styles.page,
        {
          paddingTop:templateConfigs[template].pagePadding.top,
          paddingBottom:templateConfigs[template].pagePadding.bottom,
          paddingHorizontal:templateConfigs[template].pagePadding.horizontal,
          color:templateConfigs[template].ink,
        },
        template === 'classic' ? styles.classicPage : {},
        template === 'modern' ? styles.modernPage : {},
        template === 'executive' ? styles.executivePage : {},
      ]}>
        <View style={[
          styles.header,
          template === 'classic' ? styles.classicHeader : {},
          template === 'executive' ? styles.executiveHeader : {},
        ]}>
          <Text style={[
            styles.name,
            template === 'classic' ? styles.classicName : {},
            template === 'executive' ? styles.executiveName : {},
            {fontSize:templateConfigs[template].nameFontSize * 0.75},
          ]}>{text(basics.fullName) || 'Your Name'}</Text>
          {!!text(basics.label) && <Text style={styles.role}>{text(basics.label)}</Text>}
          {!!contact && <Text style={styles.contact}>{contact}</Text>}
        </View>
        {orderedResumeSections(template).map(key=>(
          <View key={key}>
            {({ summary, experience, education, projects, skills, additional } as Record<string,ReactNode>)[key]}
          </View>
        ))}
        {!!text(basics.additionalInfo) && <Section title="Additional Information" template={template}><Text style={styles.body}>{text(basics.additionalInfo)}</Text></Section>}
      </Page>
    </Document>
  )
}
