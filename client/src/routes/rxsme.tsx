import { createFileRoute } from '@tanstack/react-router'
import ResumeDocument from '@/features/resume-builder/templates/ResumeDocument'
import { templateSchema } from '@/features/resume-builder/templates/registry'

export const Route = createFileRoute('/rxsme')({
 component: ResumePrintRoute,
})
function ResumePrintRoute(){
 const template=templateSchema.safeParse(new URLSearchParams(window.location.search).get('template'))
 return <ResumeDocument template={template.success?template.data:'modern'} printPayload />
}
