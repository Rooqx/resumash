import React from 'react'

/**
 * Spinner component for loading states
 * Usage: <Spinner className="optional-tailwind-classes" />
 */
const Spinner: React.FC = () => (
  <span
    className={`inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin align-middle`}
    aria-label="Loading..."
    role="status"
  />
)

export default Spinner
