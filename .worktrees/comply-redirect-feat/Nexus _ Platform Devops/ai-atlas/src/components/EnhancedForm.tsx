import React, { useState, useCallback, useEffect } from 'react';
import { InlineLoader } from './LoadingSpinner';

interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: (value: string) => string | null;
  options?: { value: string; label: string }[];
  autoComplete?: string;
}

interface EnhancedFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  submitLabel?: string;
  className?: string;
  showProgress?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

const EnhancedForm: React.FC<EnhancedFormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  className = '',
  showProgress = true,
  autoSave = false,
  autoSaveDelay = 2000
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Initialize form data
  useEffect(() => {
    const initialData: Record<string, string> = {};
    fields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);

    // Load from localStorage if autoSave is enabled
    if (autoSave) {
      try {
        const saved = localStorage.getItem(`form_${JSON.stringify(fields.map(f => f.name))}`);
        if (saved) {
          setFormData({ ...initialData, ...JSON.parse(saved) });
        }
      } catch (error) {
        console.warn('Failed to load saved form data:', error);
      }
    }
  }, [fields, autoSave]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const timeoutId = setTimeout(() => {
      if (Object.values(formData).some(value => value.trim())) {
        setAutoSaveStatus('saving');
        try {
          localStorage.setItem(`form_${JSON.stringify(fields.map(f => f.name))}`, JSON.stringify(formData));
          setTimeout(() => setAutoSaveStatus('saved'), 500);
          setTimeout(() => setAutoSaveStatus('idle'), 2000);
        } catch (error) {
          console.warn('Failed to auto-save form data:', error);
          setAutoSaveStatus('idle');
        }
      }
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [formData, autoSave, autoSaveDelay, fields]);

  const validateField = useCallback((field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.validation) {
      return field.validation(value);
    }

    return null;
  }, []);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }

    // Real-time validation for touched fields
    if (touched[fieldName]) {
      const field = fields.find(f => f.name === fieldName);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
      }
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const field = fields.find(f => f.name === fieldName);
    if (field) {
      const error = validateField(field, formData[fieldName] || '');
      setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name] || '');
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(fields.reduce((acc, field) => ({ ...acc, [field.name]: true }), {}));
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(formData);
      setSubmitStatus('success');
      
      // Clear auto-saved data on successful submit
      if (autoSave) {
        localStorage.removeItem(`form_${JSON.stringify(fields.map(f => f.name))}`);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedFields = fields.filter(field => formData[field.name]?.trim()).length;
  const progressPercentage = (completedFields / fields.length) * 100;

  const renderField = (field: FormField) => {
    const hasError = errors[field.name] && touched[field.name];
    const fieldValue = formData[field.name] || '';

    const inputClasses = `
      w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
      bg-dgsm-primary/50 backdrop-blur-sm
      ${hasError 
        ? 'border-red-500 focus:border-red-400' 
        : 'border-dgsm-border focus:border-dgsm-accent-blue'
      }
      text-dgsm-text-primary placeholder-dgsm-text-muted
      focus:outline-none focus:ring-2 focus:ring-dgsm-accent-blue/20
    `;

    return (
      <div key={field.name} className="space-y-2">
        <label htmlFor={field.name} className="block text-sm font-medium text-dgsm-text-primary">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.type === 'textarea' ? (
          <textarea
            id={field.name}
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            rows={4}
            className={inputClasses}
            autoComplete={field.autoComplete}
          />
        ) : field.type === 'select' ? (
          <select
            id={field.name}
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            className={inputClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            className={inputClasses}
            autoComplete={field.autoComplete}
          />
        )}
        
        {hasError && (
          <p className="text-red-500 text-sm flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors[field.name]}</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dgsm-text-secondary">Form Progress</span>
            <span className="text-dgsm-text-primary">{completedFields}/{fields.length} fields completed</span>
          </div>
          <div className="w-full bg-dgsm-border rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-dgsm-accent-blue to-dgsm-accent-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Auto-save status */}
      {autoSave && autoSaveStatus !== 'idle' && (
        <div className="flex items-center space-x-2 text-sm text-dgsm-text-muted">
          {autoSaveStatus === 'saving' && (
            <>
              <InlineLoader size="xs" />
              <span>Saving...</span>
            </>
          )}
          {autoSaveStatus === 'saved' && (
            <>
              <svg className="w-4 h-4 text-dgsm-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-dgsm-accent-green">Auto-saved</span>
            </>
          )}
        </div>
      )}

      {/* Form Fields */}
      {fields.map(renderField)}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-dgsm-accent-blue to-dgsm-accent-purple text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <InlineLoader />
            <span>Submitting...</span>
          </>
        ) : (
          <span>{submitLabel}</span>
        )}
      </button>

      {/* Submit Status */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-dgsm-accent-green/20 border border-dgsm-accent-green/30 rounded-lg text-dgsm-accent-green text-center">
          Form submitted successfully!
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center">
          There was an error submitting the form. Please try again.
        </div>
      )}
    </form>
  );
};

export default EnhancedForm;
