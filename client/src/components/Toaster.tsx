import { Toaster } from './ui/sonner'

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme="dark"
      duration={3000}
    />
  )
}
