import './Application.css';
import '../common/Forms.css'
import { useEffect, useState } from 'react';
import { fetchApplicationById, deleteApplication } from '../../services/job_tracker_api';
import { useNavigate, useParams } from "react-router-dom";
import trash from '/images/trash.png';
import pencil from '/images/pencil.png';
import ErrorBanner from '../common/ErrorBanner';
import InfoBanner from '../common/InfoBanner';
import DeleteModal from '../common/DeleteModal';

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

const ApplicationView = () => {

  const { id } = useParams();
  const appId = Number(id);

  // Validate application id
  if (!id || Number.isNaN(appId) || appId <= 0) {
    return <ErrorBanner message={'Error: Invalid application ID'} />;
  }

  const navigate = useNavigate();

  // const [formData, setFormData] = useState<ApplicationData | null>(null);
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for error messages
  const [loadError, setLoadError] = useState(''); // Fatal errors (404, invalid ID, fetch failures)
  const [deleteError, setDeleteError] = useState(''); // Delete failure

  // Fetch and Populate Data
  useEffect(() => {
    const fetchApplicationData = async () => {

      // Wait to show the loading message so it doesn't flash
      const timer = setTimeout(() => setShowLoading(true), 200);

      setLoadError('');  // Clear load errors

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
          notes: applicationData.notes ?? ''
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
  
  const handleEditClick = () => {
    // Navigate to edit route
    navigate(`/applications/${appId}/edit`);
  };

  const handleDelete = async (appId: number) => {
    setDeleteError(''); // Clear delete error
    try {
      await deleteApplication(appId);
      // Navigate with success message on successful delete
      navigate(`/applications`, { 
        state: { message: 'Job Application deleted successfully!' } 
      });
    } catch (error) {
      setDeleteError(`Failed to delete Application: ${(error as Error).message}`);
    }
  }

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
    <form>

      {/* Delete error banner (conditional rendering) */}
      {deleteError && <ErrorBanner message={deleteError} />}

      <header>
        <h1>Job Application</h1>
      </header>
      <label>Company Name:
        <input 
          name='company_name' 
          value={formData?.company_name} 
          disabled
        />
      </label>
      <label>Position Title:
        <input 
          name='position_title' 
          value={formData?.position_title} 
          disabled
        />
      </label>
      <label>Job Description:
        <input 
          name='job_description' 
          value={formData?.job_description} 
          disabled
        />
      </label>
      <label>Application URL:
        <input 
          type='url'
          name='application_url' 
          value={formData?.application_url} 
          disabled
        />
      </label>
      <label>Status:
        <select 
          name='status' 
          value={formData?.status} 
          disabled
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
          disabled
        />
      </label>
      <label>Salary Range:
        <input 
          name='salary_range' 
          value={formData?.salary_range} 
          disabled
        />
      </label>
      <label>Location:
        <input 
          name='location' 
          value={formData?.location} 
          disabled
        />
      </label>
      <label>Notes:
        <textarea 
          name='notes' 
          value={formData?.notes} 
          disabled
        />
      </label>
      <div className='buttons'>

        <button 
          className='primary'
          type='button'
          onClick={handleEditClick}
        >
          <img src={pencil} className='icon' alt='Edit icon' />
          Edit
        </button>
        
        <div>
          <button 
            type='button' 
            className='delete'
            onClick={() => setIsModalOpen(true)}
          >
            <img src={trash} className='icon' alt='Delete icon' />
            Delete
          </button>

          <DeleteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => {
              handleDelete(appId)
              setIsModalOpen(false);
            }}
          />
        </div>

      </div>

    </form>
  );
}

export default ApplicationView;