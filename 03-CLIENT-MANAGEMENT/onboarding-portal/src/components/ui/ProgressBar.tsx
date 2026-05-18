import { cn } from '@/lib/utils'

interface ProgressBarProps {
  steps: { key: string; name: string; status: string; icon?: string }[]
  currentStep: number
}

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed'
          const isCurrent = index === currentStep
          const isBlocked = step.status === 'blocked'

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                  isCompleted && 'bg-brand-600 text-white shadow-lg shadow-brand-600/30',
                  isCurrent && 'bg-brand-500 text-white ring-4 ring-brand-500/20 animate-pulse-slow',
                  !isCompleted && !isCurrent && !isBlocked && 'bg-dark-700 text-dark-400 border-2 border-dark-600',
                  isBlocked && 'bg-red-600 text-white'
                )}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isBlocked ? (
                  '!'
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs text-center hidden sm:block',
                  isCompleted && 'text-brand-400',
                  isCurrent && 'text-white font-medium',
                  !isCompleted && !isCurrent && 'text-dark-500'
                )}
              >
                {step.name}
              </span>
            </div>
          )
        })}
      </div>
      <div className="relative h-1 bg-dark-700 rounded-full -mt-6 mb-8 mx-12">
        <div
          className="absolute h-full bg-brand-600 rounded-full transition-all duration-500"
          style={{
            width: `${(currentStep / Math.max(steps.length - 1, 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
