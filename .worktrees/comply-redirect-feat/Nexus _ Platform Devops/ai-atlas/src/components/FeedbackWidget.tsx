import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EnhancedForm from './EnhancedForm';

interface FeedbackData {
  rating: number;
  feedback: string;
  email?: string;
  page: string;
  timestamp: number;
}

const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [currentStep, setCurrentStep] = useState<'rating' | 'feedback' | 'complete'>('rating');
  const [rating, setRating] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const location = useLocation();

  // Check if user has already submitted feedback for this page
  useEffect(() => {
    const feedbackKey = `feedback_${location.pathname}`;
    const submitted = localStorage.getItem(feedbackKey);
    setHasSubmitted(!!submitted);
  }, [location.pathname]);

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating);
    setCurrentStep('feedback');
  };

  const handleFeedbackSubmit = async (formData: Record<string, string>) => {
    const feedbackData: FeedbackData = {
      rating,
      feedback: formData.feedback,
      email: formData.email,
      page: location.pathname,
      timestamp: Date.now()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store feedback locally (in real app, send to API)
    const allFeedback = JSON.parse(localStorage.getItem('ai_atlas_feedback') || '[]');
    allFeedback.push(feedbackData);
    localStorage.setItem('ai_atlas_feedback', JSON.stringify(allFeedback));

    // Mark as submitted for this page
    localStorage.setItem(`feedback_${location.pathname}`, 'true');

    setCurrentStep('complete');
    setHasSubmitted(true);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      setIsOpen(false);
      setIsMinimized(true);
    }, 3000);
  };

  const resetWidget = () => {
    setCurrentStep('rating');
    setRating(0);
    setIsOpen(false);
    setIsMinimized(true);
  };

  // Don't show on signup page or if already submitted
  if (location.pathname === '/signup' || hasSubmitted) return null;

  const feedbackFormFields = [
    {
      name: 'feedback',
      type: 'textarea' as const,
      label: 'Your Feedback',
      placeholder: 'Tell us about your experience on this page...',
      required: true,
      validation: (value: string) => {
        if (value.trim().length < 10) {
          return 'Please provide at least 10 characters of feedback';
        }
        return null;
      }
    },
    {
      name: 'email',
      type: 'email' as const,
      label: 'Email (Optional)',
      placeholder: 'your.email@example.com',
      autoComplete: 'email'
    }
  ];

  return (
    <>
      {/* Minimized Widget */}
      {isMinimized && !isOpen && (
        <button
          onClick={() => {
            console.log('Feedback widget clicked');
            setIsMinimized(false);
            setIsOpen(true);
          }}
          className="feedback-widget-button"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 10000,
            backgroundColor: 'rgb(6, 182, 212)',
            color: 'white',
            padding: '16px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            transform: 'none !important' as any,
            top: 'auto !important' as any,
            left: 'auto !important' as any
          }}
          aria-label="Give feedback"
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <div 
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '12px',
              height: '12px',
              backgroundColor: 'rgb(34, 197, 94)',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}
          ></div>
        </button>
      )}

      {/* Expanded Widget */}
      {isOpen && (
        <div 
          className="feedback-widget-expanded"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '384px',
            maxHeight: '80vh',
            zIndex: 10000,
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflowY: 'auto',
            transform: 'none !important' as any,
            top: 'auto !important' as any,
            left: 'auto !important' as any
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid rgba(71, 85, 105, 0.5)'
          }}>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                margin: 0
              }}>Feedback</h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(203, 213, 225, 0.8)',
                margin: '4px 0 0 0'
              }}>Help us improve Atlas AI</p>
            </div>
            <button
              onClick={() => {
                console.log('Closing feedback widget');
                setIsOpen(false);
                setIsMinimized(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(203, 213, 225, 0.6)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                transition: 'color 0.2s ease'
              }}
              aria-label="Close feedback"
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'rgba(203, 213, 225, 0.6)';
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '16px' }}>
            {currentStep === 'rating' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'rgba(203, 213, 225, 0.8)', margin: 0 }}>How would you rate this page?</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        console.log(`Rating selected: ${star}`);
                        handleRatingSelect(star);
                      }}
                      style={{
                        fontSize: '32px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        color: star <= rating ? '#fbbf24' : 'rgba(203, 213, 225, 0.4)'
                      }}
                      aria-label={`Rate ${star} stars`}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'feedback' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'rgba(203, 213, 225, 0.8)' }}>Rating:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        style={{ 
                          color: star <= rating ? '#fbbf24' : 'rgba(203, 213, 225, 0.4)',
                          fontSize: '16px'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                <EnhancedForm
                  fields={feedbackFormFields}
                  onSubmit={handleFeedbackSubmit}
                  submitLabel="Send Feedback"
                  showProgress={false}
                />

                <button
                  onClick={() => {
                    console.log('Going back to rating');
                    setCurrentStep('rating');
                  }}
                  style={{
                    fontSize: '14px',
                    color: 'rgb(6, 182, 212)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left' as const,
                    padding: 0,
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = 'rgb(139, 92, 246)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'rgb(6, 182, 212)';
                  }}
                >
                  ← Change rating
                </button>
              </div>
            )}

            {currentStep === 'complete' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <svg 
                    style={{ width: '32px', height: '32px', color: 'rgb(34, 197, 94)' }} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'white',
                    margin: '0 0 8px 0'
                  }}>Thank you!</h4>
                  <p style={{
                    color: 'rgba(203, 213, 225, 0.8)',
                    margin: 0
                  }}>Your feedback helps us improve Atlas AI.</p>
                </div>
                <button
                  onClick={() => {
                    console.log('Resetting feedback widget');
                    resetWidget();
                  }}
                  style={{
                    fontSize: '14px',
                    color: 'rgb(6, 182, 212)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = 'rgb(139, 92, 246)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'rgb(6, 182, 212)';
                  }}
                >
                  Give more feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;
