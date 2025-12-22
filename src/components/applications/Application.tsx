import './Application.css';
import '../common/Forms.css'
import React, { useEffect, useState } from 'react';
import { fetchApplicationById, updateApplication } from '../../services/job_tracker_api';
import { useParams } from "react-router-dom";

// Defines the structure of a single job application
interface ApplicationData {
  id: number;
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
  created_at: string;
  updated_at: string;
}

const Applications = () => {

  const appId: number = Number(useParams().id);

  const [formData, setFormData] = useState<ApplicationData | null>(null);

  // https://www.techtutorial.dev/react-usestate-hook-in-details-techtutorials/
  // Declare a state variable to track the form submission status
  const [submitting, setSubmitting] = useState(false);
  
  // This is a TypeScript generic that tells useState what types of values the state can hold.
  // This state variable can be either a string OR null, nothing else.
  // The setError function can only accept values that match the type we declared: string | null.
  // Using null as a possible value gives us a clear way to represent "no error".
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState('');

  // 1. Fetch and Populate Data
  useEffect(() => {
    const fetchApplicationData = async () => {

      setError('');
      setMessage('');

      try {
        
        const applicationData = await fetchApplicationById(appId);

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
        // The nullish coalescing (??) operator is a logical operator that returns 
        // its right-hand side operand when its left-hand side operand is null or 
        // undefined, and otherwise returns its left-hand side operand.
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
          created_at: applicationData.created_at ?? '',
          updated_at: applicationData.updated_at ?? '',
        })
        
      } catch (error) {
        // If error is an Error object, set the error state to error.message.
        // Otherwise, set the error state to the generic string 'An error occurred'.
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    }

    if (!Number.isNaN(appId)) fetchApplicationData();
  }, [appId]);





  // STATUS ENUM
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
  // STATUS ENUM



  // 2. Update operation
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    // Normalize values (strings back to Numbers or null/Decimal) for the API payload
    const payload = {
      ...formData,
      user_id: formData?.user_id ? formData.user_id : null,
      company_name: formData?.company_name || null,
      position_title: formData?.position_title || null,
      job_description: formData?.job_description || null,
      application_url: formData?.application_url || null,
      status: formData?.status || null,
      date_applied: formData?.date_applied || null,
      salary_range: formData?.salary_range || null,
      location: formData?.location || null,
      notes: formData?.notes || null,
      created_at: formData?.created_at || null,
      updated_at: formData?.updated_at || null,
    };

    try {
      console.log(payload)
      await updateApplication(appId, payload);
      setMessage('Job application updated successfully!');
    } catch (error) {
      setError(`Failed to update Application: ${(error as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Conditional Rendering (Handling Loading and Errors)
  {error && <p className="error">Error: {error}</p>}
  {message && <p className="success">{message}</p>}


  if (formData === null) {
    return (
      <section className="update-car">
        <h2>Loading Job Application Details...</h2>
      </section>
    );
  }

  if (Object.keys(formData).length === 0 && error) {
     return (
      <section className="update-car">
        <p className="error">Error: {error}</p>
      </section>
     );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Job Application</h1>
      <label>Company Name:
        <input 
          type="text" 
          name="company_name" 
          value={formData?.company_name} 
          onChange={handleChange}  
        />
      </label>
      <label>Position Title:
        <input name="position_title" value={formData?.position_title} onChange={handleChange} />
      </label>
      <label>Job Description:
        <input name="job_description" value={formData?.job_description} onChange={handleChange} />
      </label>
      <label>Application URL:
        <input name="application_url" value={formData?.application_url} onChange={handleChange} />
      </label>
      <label>Status:
        {/* <input name="status" value={formData?.status} onChange={handleChange} /> */}
        <select 
          name="status" 
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
        <input name="date_applied" value={formData?.date_applied} onChange={handleChange} />
      </label>
      <label>Salary Range:
        <input name="salary_range" value={formData?.salary_range} onChange={handleChange} />
      </label>
      <label>Location:
        <input name="location" value={formData?.location} onChange={handleChange} />
      </label>
      <label>Notes:
        <textarea name="notes" value={formData?.notes} onChange={handleChange} />
      </label>
      <label>Created At:
        <input name="created_at" value={formData?.created_at} onChange={handleChange} />
      </label>
      <label>Updated At:
        <input name="updated_at" value={formData?.updated_at} onChange={handleChange} />
      </label>
      <div>
        <button className='delete'>Delete</button>
        <button className='new'>New</button>
        <button 
          className='save' 
          type='submit' 
          disabled={submitting}
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button className='edit'>Edit</button>
      </div>
    </form>
  );
}

export default Applications;