const tsxStyles = ({
  isDesktop,
  isTablet,
  isMobile,
}: {
  isDesktop: boolean
  isTablet: boolean
  isMobile: boolean
}) => {
  const styles = {
    page: {
      width: isDesktop ? '50vw' : isTablet ? '75%' : isMobile ? '100%' : '100%',
      height: isDesktop
        ? '800px'
        : isTablet
          ? '700px'
          : isMobile
            ? '600px'
            : '600px',

      border: '1px solid black',
      display: 'flex',
      flexDirection: 'column' as const,
      backgroundColor: '#FFFFFF',
      padding: '30px',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: !isDesktop ? '16px' : '8px',
      lineHeight: '1.4',
      color: '#000',
    },
    header: {
      marginBottom: '20px',
      borderBottom: '1pt solid #2c5530',
      paddingBottom: '2px',
    },
    name: {
      fontSize: !isDesktop ? '16px' : '24px',
      fontWeight: 'bold' as const,
      color: 'black',
      marginBottom: '5px',
    },
    label: {
      fontSize: !isDesktop ? '5px' : '10px',
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
      fontSize: !isDesktop ? '5px' : '9px',
      color: '#666666',
      display: 'flex',
      justifyContent: 'center',
      gap: '5px',
    },
    section: {
      marginBottom: '10px',
    },
    sectionTitle: {
      fontSize: !isDesktop ? '6px' : '12px',
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
    company: {
      fontSize: !isDesktop ? '5px' : '10px',
      fontWeight: 'bold' as const,
    },
    position: {
      fontSize: !isDesktop ? '5px' : '10px',
      color: '#3a3a3a',
      fontWeight: 'semibold' as const,
    },
    date: {
      fontSize: !isDesktop ? '5px' : '9px',
      color: '#666666',
      minWidth: '110px',
    },
    jobSummary: {
      fontSize: !isDesktop ? '5px' : '9px',
      color: '#333333',
      textAlign: 'justify' as const,
    },
    jobHighlights: {
      fontSize: !isDesktop ? '5px' : '9px',
      color: '#333333',
      textAlign: 'justify' as const,
      marginTop: '5px',
      marginLeft: '15px',
    },
    educationItem: {
      marginBottom: '8px',
    },
    institution: {
      fontSize: !isDesktop ? '5px' : '10px',
      fontWeight: 'bold' as const,
      marginBottom: '2px',
    },
    studyType: { fontSize: !isDesktop ? '5px' : '9px', color: '#4a4a4a' },
    skillItem: { marginBottom: '5px' },
    skillName: {
      fontSize: !isDesktop ? '5px' : '9px',
      fontWeight: 'bold' as const,
      marginBottom: '1px',
    },
    skillLevel: {
      fontSize: !isDesktop ? '4px' : '8px',
      color: '#666666',
      fontWeight: 'bold' as const,
    },
    projectItem: { marginBottom: '8px' },
    projectName: {
      fontSize: !isDesktop ? '5px' : '10px',
      fontWeight: 'bold' as const,
      marginBottom: '2px',
    },
    projectDescription: {
      fontSize: !isDesktop ? '5px' : '9px',
      color: '#333333',
      textAlign: 'justify' as const,
    },
    languageItem: { fontSize: !isDesktop ? '5px' : '9px', marginBottom: '2px' },
  }
  return styles
}

export default tsxStyles
