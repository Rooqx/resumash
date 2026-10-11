import { createFileRoute } from '@tanstack/react-router'
import HomePage from '@/features/home/HomePage'
import ResumashShell from '@/components/ResumashShell'
import SEO from '@/components/SEO'

export const Route = createFileRoute('/')({component: HomeRoute})

function HomeRoute() {
 return <ResumashShell>
  <SEO title="Resumash | Build. Tailor. Apply." description="Build a resume, tailor it to any role, and create a cover letter without signing up." />
  <HomePage />
 </ResumashShell>
}
