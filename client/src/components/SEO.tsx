// components/SEO.tsx
import { Helmet } from 'react-helmet-async'

type SEOProps = {
  title: string
  description?: string
}

export default function SEO({ title, description }: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  )
}
