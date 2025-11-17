export async function downloadResume(fileName: string) {
  try {
    const res = await fetch(
      'http://localhost:5000/api/v1/resumes/download-resume',
    )
    console.log('fetch:', res)
    const blob = await res.blob()

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = fileName
    a.click()
  } catch (error) {
    console.log('error:', error)
  }
}

/* export default function DownloadButton() {
  return <button onClick={downloadResume}>Download PDF</button>
}
*/
