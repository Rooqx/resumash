import axios from 'axios'

export const getTailoredResume = async ({
  jobDescription,
  file,
}: {
  jobDescription: string
  file: File | null
}) => {
  if (!file || jobDescription.trim() === '') {
    alert('Please provide both a job description and a resume file.')
    return
  }
  try {
    const formData = new FormData()
    formData.append('jobDescription', jobDescription)
    formData.append('file', file)

    const response = await axios('http://localhost:4000/api/v1/upload', {
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('response', response.data)
  } catch (err) {
    console.error('Error tailoring resume:', err)
  }
}
