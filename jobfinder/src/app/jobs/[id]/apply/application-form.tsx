"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '@/lib/types';

interface ApplicationFormProps {
  job: Job;
}

export default function ApplicationForm({ job }: ApplicationFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    coverLetter: '',
    heardAbout: '',
    willingToRelocate: false,
    startDate: '',
    experience: '',
    resume: null as File | null,
    coverLetterFile: null as File | null,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFileError, setShowFileError] = useState(false);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [fieldName]: files[0] }));
      setShowFileError(false);
      
      // Clear error when field is edited
      if (errors[fieldName]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional but validate format if provided)
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // URL validations (optional but validate format if provided)
    if (formData.linkedin && !/^https?:\/\/([a-z]+\.)?linkedin\.com\/.*$/.test(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    
    if (formData.portfolio && !/^https?:\/\/.*$/.test(formData.portfolio)) {
      newErrors.portfolio = 'Please enter a valid URL';
    }
    
    // Resume validation
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
      setShowFileError(true);
    }
    
    // Experience validation
    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the application data (omitting file objects which can't be JSON serialized)
      const applicationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        linkedin: formData.linkedin || null,
        portfolio: formData.portfolio || null,
        coverLetter: formData.coverLetter || null,
        heardAbout: formData.heardAbout || null,
        willingToRelocate: formData.willingToRelocate,
        startDate: formData.startDate || null,
        experience: formData.experience,
        resumeFilename: formData.resume?.name || null,
        coverLetterFilename: formData.coverLetterFile?.name || null,
        applicationDate: new Date().toISOString()
      };
      
      // Send application data to API
      console.log('Submitting application to API...');
      const response = await fetch(`/api/jobs/${job._id?.toString() || job.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      if (!response.ok) {
        throw new Error(`Application submission failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Application submitted successfully:', result);
      
      // Redirect to success page
      router.push(`/jobs/${job._id?.toString() || job.id}/apply/success`);
    } catch (error) {
      console.error('Error submitting application:', error);
      setIsSubmitting(false);
      
      // Show a general error at the top of the form
      setErrors(prev => ({
        ...prev,
        form: 'There was an error submitting your application. Please try again.'
      }));
      
      // Scroll to top to show the error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Application Form</h2>
      
      {/* Form Error Message */}
      {errors.form && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.form}</p>
        </div>
      )}
      
      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            />
            {errors.firstName && (
              <p id="firstName-error" className="mt-1 text-sm text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="mt-1 text-sm text-red-600">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className={`w-full px-3 py-2 border ${errors.linkedin ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              aria-invalid={!!errors.linkedin}
              aria-describedby={errors.linkedin ? 'linkedin-error' : undefined}
            />
            {errors.linkedin && (
              <p id="linkedin-error" className="mt-1 text-sm text-red-600">
                {errors.linkedin}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio / Website
            </label>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="https://yourportfolio.com"
              className={`w-full px-3 py-2 border ${errors.portfolio ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              aria-invalid={!!errors.portfolio}
              aria-describedby={errors.portfolio ? 'portfolio-error' : undefined}
            />
            {errors.portfolio && (
              <p id="portfolio-error" className="mt-1 text-sm text-red-600">
                {errors.portfolio}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Experience and Qualifications */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience and Qualifications</h3>
        
        <div className="mb-4">
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
            Resume <span className="text-red-600">*</span>
          </label>
          <div className={`w-full px-3 py-2 border ${showFileError && errors.resume ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white`}>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, 'resume')}
              className="sr-only"
            />
            <label
              htmlFor="resume"
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm text-gray-500 truncate">
                {formData.resume ? formData.resume.name : 'Upload your resume (PDF, DOC, DOCX)'}
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700">
                Browse
              </span>
            </label>
          </div>
          {showFileError && errors.resume && (
            <p id="resume-error" className="mt-1 text-sm text-red-600">
              {errors.resume}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Max file size: 5MB</p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="coverLetterFile" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter (optional)
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white">
            <input
              type="file"
              id="coverLetterFile"
              name="coverLetterFile"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, 'coverLetterFile')}
              className="sr-only"
            />
            <label
              htmlFor="coverLetterFile"
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm text-gray-500 truncate">
                {formData.coverLetterFile ? formData.coverLetterFile.name : 'Upload your cover letter (PDF, DOC, DOCX)'}
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700">
                Browse
              </span>
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">Max file size: 5MB</p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Years of Relevant Experience <span className="text-red-600">*</span>
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white`}
            aria-invalid={!!errors.experience}
            aria-describedby={errors.experience ? 'experience-error' : undefined}
          >
            <option value="">Select experience level</option>
            <option value="0-1">Less than 1 year</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
          {errors.experience && (
            <p id="experience-error" className="mt-1 text-sm text-red-600">
              {errors.experience}
            </p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
            Why are you a good fit for this position? (optional)
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tell us why you're interested in this position and how your skills and experience make you a good fit..."
          />
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            When can you start?
          </label>
          <select
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="">Select availability</option>
            <option value="immediately">Immediately</option>
            <option value="2_weeks">2 weeks notice</option>
            <option value="1_month">1 month notice</option>
            <option value="2_months">2+ months notice</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="heardAbout" className="block text-sm font-medium text-gray-700 mb-1">
            How did you hear about this job?
          </label>
          <select
            id="heardAbout"
            name="heardAbout"
            value={formData.heardAbout}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="">Select option</option>
            <option value="jobfinder">JobFinder.com</option>
            <option value="linkedin">LinkedIn</option>
            <option value="indeed">Indeed</option>
            <option value="glassdoor">Glassdoor</option>
            <option value="referral">Employee Referral</option>
            <option value="social">Social Media</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="mb-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="willingToRelocate"
                name="willingToRelocate"
                type="checkbox"
                checked={formData.willingToRelocate}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="willingToRelocate" className="font-medium text-gray-700">
                I am willing to relocate if necessary
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Submit Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            By submitting this application, you confirm that all information provided is true and complete to the best of your knowledge.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </div>
    </form>
  );
} 