import type { Metadata } from 'next'
import './globals.css'
import { PostHogProvider } from '@/lib/posthog'
import * as Sentry from '@sentry/nextjs'

export const metadata: Metadata = {
  title: 'Client Onboarding Portal | Taurus AI',
  description: 'Streamlined client onboarding for Taurus AI platforms',
}

export function layoutWithSentry() {
  return function withSentry(Component: React.ComponentType) {
    return function WrappedComponent(props: unknown) {
      return (
        <Sentry.ErrorBoundary
          fallback={<div className="p-8 text-center text-white">Something went wrong. Please refresh the page.</div>}
        >
          <Component {...props} />
        </Sentry.ErrorBoundary>
      )
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}