import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

export const downloadPDF = async (inputValue: any, pdfRef: any) => {
  const element = pdfRef.current
  if (!element) return

  // Make sure it's visible before capture
  element.style.display = 'block'

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/jpeg', 1.0)
  const pdf = new jsPDF('p', 'mm', 'a4')

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Convert pixels to mm
  const pxToMm = (px: number) => (px * 25.4) / 96
  const canvasWidthMm = pxToMm(canvas.width)
  const canvasHeightMm = pxToMm(canvas.height)

  const imgWidth = pageWidth
  const imgHeight = (canvasHeightMm * pageWidth) / canvasWidthMm

  let heightLeft = imgHeight
  let position = 0

  // Draw first page
  pdf.addImage(imgData, 'JPEG', 5, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  // Add extra pages only if needed
  while (heightLeft > 1) {
    position -= pageHeight
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(`${inputValue.fullName?.split(' ').join('_') || 'resume'}.pdf`)
}
