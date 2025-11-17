import { createFileRoute } from '@tanstack/react-router'
import ResumePDF from '@/resumeTemplates/template1/PDFTemplate'

export const Route = createFileRoute('/rxsme')({
  component: () => <ResumePDF />,
})
