import axios from 'axios'
import { toast } from 'sonner'

export const getTailoredResume = async ({
  jobDescription,
  file,
}: {
  jobDescription: string
  file: any | null
}) => {
  if (!file || jobDescription.trim() === '') {
    toast.error('Please provide both a job description and a resume file.')
    return
  }
  try {
    const formData = new FormData()
    formData.append('jobDescription', jobDescription)
    formData.append('resume', file)

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/resumes/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data
  } catch (_err) {}
}
