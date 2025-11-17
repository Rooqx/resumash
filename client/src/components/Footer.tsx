import { Linkedin, LucideTwitter } from 'lucide-react'
import React from 'react'

type FooterProps = {
  /** Show social icons (LinkedIn, X, GitHub) */
  showSocial?: boolean
  /** Small text that appears above the copyright line */
  tagline?: string
}

const currentYear = new Date().getFullYear()

export default function Footer({
  showSocial = true,
  tagline = 'Build, Tailor,  Get Hired.',
}: FooterProps) {
  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-black text-white flex items-center justify-center font-semibold">
                R
              </div>
              <div className="text-sm font-semibold">Resumash</div>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-md">
              {tagline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <nav aria-label="footer-navigation" className="flex gap-4 text-sm">
              <a href="/privacy" className="hover:underline">
                Privacy
              </a>
              <a href="/terms" className="hover:underline">
                Terms
              </a>
              <a href="/support" className="hover:underline">
                Support
              </a>
            </nav>

            {showSocial && (
              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                <SocialLink
                  href="https://www.linkedin.com/company/resumash"
                  label="Resumash on LinkedIn"
                >
                  <Linkedin />
                </SocialLink>

                <SocialLink href="https://x.com/resumash" label="Resumash on X">
                  <LucideTwitter />
                </SocialLink>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 flex items-center justify-center">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div>© {currentYear} Resumash. All rights reserved.</div>
            <div className="text-xs">
              Made with care • ATS-friendly templates
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  children,
  label,
}: {
  href: string
  children: React.ReactNode
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      <span className="sr-only">{label}</span>
      <div className="w-6 h-6">{children}</div>
    </a>
  )
}
