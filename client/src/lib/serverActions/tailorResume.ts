import axios from 'axios'

export const getTailoredResume = async ({
  jobDescription,
  file,
}: {
  jobDescription: string
  file: any | null
}) => {
  if (!file || jobDescription.trim() === '') {
    alert('Please provide both a job description and a resume file.')
    return
  }
  try {
    const formData = new FormData()
    formData.append('jobDescription', jobDescription)
    formData.append('resume', file)

    console.log('formData', formData)

    const response = await axios.post(
      'http://localhost:4000/api/v1/resumes/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data
  } catch (err) {
    console.error('Error tailoring resume:', err)
  }
}
