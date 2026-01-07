import './Application.css';
import '../common/Forms.css'
import React, { useEffect, useState } from 'react';
import { createApplication } from '../../services/job_tracker_api';
import { useNavigate } from "react-router-dom";
import plus from '/images/plus.png';
import ErrorBanner from '../common/ErrorBanner';

// Defines the structure of a single job application
interface ApplicationData {
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

const initialForm = {
  // TODO: Figure out how to persist my user id on all api calls. (A step closer to auth)
  user_id: '1', // I'm the only user, so hard-coding my id 
  company_name: '',
  position_title: '',
  job_description: '',
  application_url: '',
  status: '',
  date_applied: '',
  salary_range: '',
  location: '',
  notes: ''
}

const ApplicationNew = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState<ApplicationData | null>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  
  // State for error message
  const [submitError, setSubmitError] = useState(''); // Submission errors (save failures)
  
  // Status enum for select input (dropdown)
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

  // Add opperation
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError(''); // Clear previous submission errors

    // Normalize values to match the API model types.
    const payload = {
      // Uses optional chaining (?.) to safely access user_id. 
      // If it exists, it's included; otherwise, null is assigned.
      user_id: formData?.user_id || null,
      // Uses the logical OR (||) operator to assign company_name if truthy; 
      // otherwise, defaults to null. This pattern is repeated for other 
      // fields like position_title, job_description, etc.
      company_name: formData?.company_name || null,
      position_title: formData?.position_title || null,
      job_description: formData?.job_description || null,
      application_url: formData?.application_url || null,
      status: formData?.status || 'bookmarked', // bookmarked is the default status
      date_applied: formData?.date_applied || null,
      salary_range: formData?.salary_range || null,
      location: formData?.location || null,
      notes: formData?.notes || null
    };

    try {
      console.log(payload)
      await createApplication(payload);
      // Navigate with success message on successful update
      navigate('/applications', { 
        state: { message: 'New Job Application added successfully!' } 
      });
    } catch (error) {
      // setError(`Failed to add new Job Application: ${(error as Error).message}`);
      setSubmitError(`Failed to update Application: ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // render the form
  return (
    <
      form onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLElement && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }}
    >

      {/* Submission error banner (conditional rendering) */}
      {submitError && <ErrorBanner message={submitError} />}

      <header>
        <h1>New Job Application</h1>
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
          <img src={plus} className='icon' alt='Add icon' />
          Add Application
        </button>
      </div>

    </form>
  );
}

export default ApplicationNew;