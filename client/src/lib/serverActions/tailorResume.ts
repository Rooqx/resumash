import axios from 'axios'

export const getTailoredResume = async ({
 jobDescription,
 file,
}: {
 jobDescription: string
 file: File | null
}) => {
 if (!file || !jobDescription.trim()) {
   throw new Error('Please provide a job description and a resume.')
 }
 const formData = new FormData()
 formData.append('jobDescription', jobDescription)
 formData.append('resume', file)
 const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_DEVELOPMENT_BACKEND_URL
 if (!backendUrl) throw new Error('Resume service is not configured.')
 const response = await axios.post(`${backendUrl}/api/v1/resumes/upload`, formData, {timeout:330000})
 return response.data
}
