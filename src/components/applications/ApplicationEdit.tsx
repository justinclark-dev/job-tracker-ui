import './Application.css';
import '../common/Forms.css'
import React, { useEffect, useState } from 'react';
import { fetchApplicationById, updateApplication } from '../../services/job_tracker_api';
import { useNavigate, useParams } from "react-router-dom";
import update_icon from '/images/update.png';
import ErrorBanner from '../common/ErrorBanner';
import InfoBanner from '../common/InfoBanner';

// Defines the structure of a single job application
interface ApplicationData {
  id: number | null;
  user_id: string;
  company_name: string;
  position_title: string;
  job_description: string;
  application_url: string;
  status: string;
  date_applied: string;
  salary_range: string;
  location: string;
  notes: string;
}

const ApplicationEdit = () => {

  const { id } = useParams();
  const appId = Number(id);

  // Validate application id
  if (!id || Number.isNaN(appId) || appId <= 0) {
    return <ErrorBanner message={'Error: Invalid application ID'} />;
  }

  const navigate = useNavigate();

  // Initialize with empty form
  const [formData, setFormData] = useState<ApplicationData>({
    id: null,
    user_id: '',
    company_name: '',
    position_title: '',
    job_description: '',
    application_url: '',
    status: '',
    date_applied: '',
    salary_range: '',
    location: '',
    notes: ''
  });

  const [showLoading, setShowLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Separate error states for clarity
  const [loadError, setLoadError] = useState(''); // Fatal errors (404, invalid ID, fetch failures)
  const [submitError, setSubmitError] = useState(''); // Submission errors (save failures)

  // Fetch and Populate Data
  useEffect(() => {
    const fetchApplicationData = async () => {

      // Wait to show the loading message so it doesn't flash 
      const timer = setTimeout(() => setShowLoading(true), 200);

      setLoadError('');  // Clear load errors

      try {
        
        const applicationData = await fetchApplicationById(appId);

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
        // The nullish coalescing (??) operator returns its right-hand side operand when its left-hand 
        // side operand is null or undefined, but not for other falsy values like 0, '', or false.
        // (Use the value if it exists, otherwise use an empty string).
        setFormData({
          id: applicationData.id ?? '',
          user_id: applicationData.user_id ?? '',
          company_name: applicationData.company_name ?? '',
          position_title: applicationData.position_title ?? '',
          job_description: applicationData.job_description ?? '',
          application_url: applicationData.application_url ?? '',
          status: applicationData.status ?? '',
          date_applied: applicationData.date_applied ?? '',
          salary_range: applicationData.salary_range ?? '',
          location: applicationData.location ?? '',
          notes: applicationData.notes ?? '',
        });
        
      } catch (error) {
        // Stop the loading screen by setting form to an empty object
        setFormData({} as ApplicationData); 
        setLoadError(error instanceof Error ? error.message : 'Failed to load application');
      } finally {
        clearTimeout(timer);
        setShowLoading(false);
      }
    }

    fetchApplicationData();

  }, [appId]);

  // Status enum for dropdown (select)
  interface StatusChoice {
    value: string;
    label: string;
  }

  const [statusOptions, setStatusOptions] = useState<StatusChoice[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/status-choices/')
      .then(res => res.json())
      .then(data => setStatusOptions(data.choices));
  }, []);

  // Handle form changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update operation
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError(''); // Clear previous submission errors

    // Normalize values to match the API model types.
    const payload = {
      // ...formData: Spreads all existing properties from formData into payload.
      ...formData, 
      // Uses optional chaining (?.) to safely access user_id. 
      // If it exists, it's included; otherwise, null is assigned.
      user_id: formData?.user_id ? formData.user_id : null, 
      // Uses the logical OR (||) operator to assign company_name if truthy; 
      // otherwise, defaults to null. This pattern is repeated for other 
      // fields like position_title, job_description, etc.
      company_name: formData?.company_name || null, 
      position_title: formData?.position_title || null,
      job_description: formData?.job_description || null,
      application_url: formData?.application_url || null,
      status: formData?.status || null,
      date_applied: formData?.date_applied || null,
      salary_range: formData?.salary_range || null,
      location: formData?.location || null,
      notes: formData?.notes || null
    };

    try {
      console.log(payload)
      await updateApplication(appId, payload);
      // Navigate with success message on successful update
      navigate('/applications', { 
        state: { message: 'Job Application updated successfully!' } 
      });
    } catch (error) {
      setSubmitError(`Failed to update Application: ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Conditional Rendering (Handling Loading and Errors)
  
  // CASE 1: Still loading
  if (showLoading) {
    return <InfoBanner message="Loading Job Application Details..." />;
  }

  // CASE 2: Fatal load error (invalid ID, 404, fetch failure)
  if (loadError) {
    return <ErrorBanner message={loadError} />;
  }

  // CASE 3: Success - render the form
  return (
    <form 
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLElement && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }}
    >

      {/* Submission error banner (conditional rendering) */}
      {submitError && <ErrorBanner message={submitError} />}

      <header>
        <h1>Job Application</h1>
      </header>
      <label>Company Name:
        <input 
          name='company_name' 
          value={formData?.company_name} 
          onChange={handleChange} 
          required
        />
      </label>
      <label>Position Title:
        <input 
          name='position_title' 
          value={formData?.position_title} 
          onChange={handleChange} 
          required
        />
      </label>
      <label>Job Description:
        <input 
          name='job_description' 
          value={formData?.job_description} 
          onChange={handleChange} 
        />
      </label>
      <label>Application URL:
        <input 
          type='url'
          name='application_url' 
          value={formData?.application_url} 
          onChange={handleChange} 
          required
        />
      </label>
      <label>Status:
        <select 
          name='status' 
          value={formData?.status} 
          onChange={handleChange}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>Date Applied:
        <input 
          type='date'
          name='date_applied' 
          value={formData?.date_applied} 
          onChange={handleChange} 
        />
      </label>
      <label>Salary Range:
        <input 
          name='salary_range' 
          value={formData?.salary_range} 
          onChange={handleChange} 
        />
      </label>
      <label>Location:
        <input 
          name='location' 
          value={formData?.location} 
          onChange={handleChange}
        />
      </label>
      <label>Notes:
        <textarea 
          name='notes' 
          value={formData?.notes} 
          onChange={handleChange}
        />
      </label>

      <div className='buttons'>
        <button 
          className='primary' 
          type='submit' 
          disabled={submitting}
        >
          <img src={update_icon} className='icon' alt='Update icon' />
          {submitting ? 'Updating...' : 'Update'}
        </button>
      </div>

    </form>
  );
}

export default ApplicationEdit;