import React, { memo, useState } from 'react'

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
  sizes?: string
  loading?: boolean
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', // tiny transparent placeholder
  sizes = '(max-width: 768px) 100vw, 50vw',
  loading = false,
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = () => setLoaded(true)
  const handleError = () => setError(true)

  return (
    <img
      src={error ? placeholder : src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      loading={loading ? 'lazy' : 'eager'}
      srcSet={`
        ${src}?w=480 480w,
        ${src}?w=768 768w,
        ${src}?w=1024 1024w
      `}
      sizes={sizes}
      onLoad={handleLoad}
      onError={handleError}
      decoding="async"
      style={{ objectFit: 'cover' }}
    />
  )
}

export default memo(Image)
