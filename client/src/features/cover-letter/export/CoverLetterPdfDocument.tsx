import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { paddingTop: 52, paddingBottom: 52, paddingHorizontal: 52, fontFamily: 'Helvetica', color: '#181818', fontSize: 10.5 },
  header: { borderBottomWidth: 1, borderBottomColor: '#d6d6d6', paddingBottom: 16, marginBottom: 26 },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 19, marginBottom: 7 },
  metadata: { color: '#555555', fontSize: 10 },
  paragraph: { marginBottom: 13, lineHeight: 1.65 },
  modernPage: { paddingTop: 52, paddingBottom: 52, paddingHorizontal: 52, fontFamily: 'Helvetica', color: '#181818', fontSize: 10.5, borderLeftWidth: 3, borderLeftColor: '#434343' },
  modernName: { fontFamily: 'Helvetica-Bold', fontSize: 21, marginBottom: 7, color: '#333333' },
})

/** Selectable-text, multipage A4 export; no server-side browser renderer. */
export default function CoverLetterPdfDocument({ name, role, company, letter, layout = 'ats' }: {
  name: string; role: string; company: string; letter: string; layout?: 'ats' | 'modern'
}) {
  return <Document title={`Cover letter — ${name}`}>
    <Page size="A4" style={layout==='modern'?styles.modernPage:styles.page} wrap>
      <View style={styles.header}>
        <Text style={layout==='modern'?styles.modernName:styles.name}>{name.trim()}</Text>
        <Text style={styles.metadata}>{[role.trim(), company.trim()].filter(Boolean).join(' · ')}</Text>
      </View>
      {letter.trim().split(/\n\s*\n/).map((paragraph, index) =>
        <Text key={index} style={styles.paragraph}>{paragraph.trim()}</Text>)}
    </Page>
  </Document>
}
