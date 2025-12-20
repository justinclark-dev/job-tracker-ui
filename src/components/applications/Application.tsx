import './Application.css';
import { useEffect, useState } from 'react';
import { fetchApplicationById } from '../../services/job_tracker_api';
import { useParams } from "react-router-dom";

const Applications = () => {

  const { id } = useParams();
  const appId: number = Number(id); 
  // turns the params :id into integer
  
  const [applicationValues, setApplicationValues] = useState({
    id: 0,
    user_id: '',
    company_name: '',
    position_title: '',
    job_description: '',
    application_url: '',
    status: '',
    date_applied: '',
    salary_range: '',
    location: '',
    notes: '',
    created_at: '',
    updated_at: '',
  });

  const [loading, setLoading] = useState(true);

  // This is a TypeScript generic that tells useState what types of values the state can hold.
  // This state variable can be either a string OR null, nothing else.
  // The setError function can only accept values that match the type we declared: string | null.
  // Using null as a possible value gives us a clear way to represent "no error".
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const applicationData = await fetchApplicationById(appId);
        setApplicationValues(applicationData)

      } catch (error) {
        // If error is an Error object, set the error state to error.message.
        // Otherwise, set the error state to the generic string 'An error occurred'.
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {

        // setTimeout(() => {
        //   setLoading(false);
        // }, 2000);

        setLoading(false);
      }
    }

    if (!Number.isNaN(appId)) fetchApplicationData();
  }, [appId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleChange = () => {}

  return (
    <form>
      <label>Company Name:
        <input name="company_name" value={applicationValues.company_name} onChange={handleChange} readOnly />
      </label>
      <label>Position Title:
        <input name="position_title" value={applicationValues.position_title} onChange={handleChange} readOnly />
      </label>
      <label>Job Description:
        <input name="job_description" value={applicationValues.job_description} onChange={handleChange} readOnly />
      </label>
      <label>Application URL:
        <input name="application_url" value={applicationValues.application_url} onChange={handleChange} readOnly />
      </label>
      <label>Status:
        <input name="status" value={applicationValues.status} onChange={handleChange} readOnly />
      </label>
      <label>Date Applied:
        <input name="date_applied" value={applicationValues.date_applied} onChange={handleChange} readOnly />
      </label>
      <label>Salary Range:
        <input name="salary_range" value={applicationValues.salary_range} onChange={handleChange} readOnly />
      </label>
      <label>Location:
        <input name="location" value={applicationValues.location} onChange={handleChange} readOnly />
      </label>
      <label>Notes:
        <textarea name="notes" value={applicationValues.notes} onChange={handleChange} readOnly />
      </label>
      <label>Created At:
        <input name="created_at" value={applicationValues.created_at} onChange={handleChange} readOnly />
      </label>
      <label>Updated At:
        <input name="updated_at" value={applicationValues.updated_at} onChange={handleChange} readOnly />
      </label>
    </form>
  );
}

export default Applications;