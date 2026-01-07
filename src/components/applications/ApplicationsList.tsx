import './ApplicationsList.css';
import '../common/Forms.css'
import React, { useEffect, useState, useRef } from 'react';
import { fetchApplications } from '../../services/job_tracker_api';
import { useNavigate } from 'react-router-dom';
import plus from '/images/plus.png';
import { useLocation } from 'react-router-dom';
import SuccessBanner from '../common/SuccessBanner';

const ApplicationList = () => {

  const location = useLocation();
  const [message, setMessage] = useState('');

    useEffect(() => {
    // Check if there's a message from navigation
    if (location.state?.message) {
      setMessage(location.state.message);
      
      // Clear the message after a few seconds
      const timer = setTimeout(() => setMessage(''), 5000);
      
      // Clear navigation state so message doesn't reappear on refresh
      window.history.replaceState({}, document.title);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  const [applications, setApplications] = useState([]);
  
  // https://www.webdevtutor.net/blog/typescript-typecast
  // explicitly cast error as either or string or null
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  /** Claude AI Help ***************************************************************
   *
   * I used extensive help from Claude AI in order to get the tool tip to follow the user's
   * mouse as it traverses each row of the Job Applications data table. This section
   * was produced by AI.
   * 
   * Here is a link to that AI chat interation:
   * https://claude.ai/share/faf17c53-63b8-4096-b529-88dda54d9b34
   */
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Only track visibility in state, NOT position
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const currentRowId = useRef<number | null>(null);

  const handleRowEnter = (rowId: number) => {
    currentRowId.current = rowId;
    setTooltipVisible(true);
  };

  const handleRowLeave = (rowId: number) => {
    if (currentRowId.current === rowId) {
      currentRowId.current = null;
      setTooltipVisible(false);
    }
  };

  // https://www.webdevtutor.net/blog/typescript-type-for-mouse-click-event
  // Update position directly via DOM manipulation - no state updates!
  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltipVisible && tooltipRef.current) {
      // Directly manipulate the tooltip position without triggering re-renders
      tooltipRef.current.style.left = `${e.clientX + 15}px`;
      tooltipRef.current.style.top = `${e.clientY + 15}px`;
    }
  };

  const handleContainerLeave = () => {
    currentRowId.current = null;
    setTooltipVisible(false);
  };

  /** Claude AI Help ***************************************************************
   *
   * I couldn't figure out how to fix the TypeScript type error on "applications":
   *        function Application({ applications }) {...}
   * 
   * The AI suggested this concise line that I did not fully understand:
   *        function Application({ applications }: { applications: any[] }) {...}
   * 
   * In the end I used the AI written line:
   *        const Application = ({ applications }: ApplicationProps) => {...}
   * ...which required me to add two interfaces: ApplicationData & ApplicationProps
   * both of which are denoted in this Claude AI Help section. Adding both interfaces helps 
   * me to better understand how to set the types.
   * 
   * Here is a link that AI chat:
   * https://claude.ai/share/f162cd17-75a3-4e05-9fe7-945e967b352a
   */

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

  interface ApplicationProps {
    // https://www.geeksforgeeks.org/typescript/what-is-interfaces-and-explain-it-in-reference-of-typescript/
    // since ApplicationData is an interface, it can be used as type for applications
    applications: ApplicationData[];
  }

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      }
    }

    loadApplications(); 
  }, []); 

  if (error) return <p>Error: {error}</p>;

  const handleRowClick = (id: number) => {
    navigate(`/applications/${id}`);
  };

  const handleNewApplicationClick = () => {
    navigate(`/applications/new`);
  };

  const Application = ({ applications }: ApplicationProps) => {
    return (
      <div 
        ref={tableContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleContainerLeave}
        className='table-container'
      >
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Position Title</th>
              <th>Status</th>
              <th>Date Applied</th>
              <th>Salary Range</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr 
                key={application.id} 
                onClick={() => handleRowClick(application.id)}
                onMouseEnter={() => handleRowEnter(application.id)}
                onMouseLeave={() => handleRowLeave(application.id)}
              >
                <td>{application.company_name}</td>
                <td>{application.position_title}</td>
                <td>{application.status}</td>
                <td>{application.date_applied}</td>
                <td>{application.salary_range}</td>
                <td>{application.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tooltipVisible && (
          <div 
            ref={tooltipRef}
            className='tooltip'
            style={{
              left: 0,
              top: 0,
            }}
          >
            Click to open this job application.
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {message && <SuccessBanner message={message} />}

      <header>
        <h1>Job Applications</h1>
        <div>
          <button 
            type='button'
            className='primary'
            onClick={handleNewApplicationClick}
          >
            <img src={plus} className='icon' alt='Add icon' />
            New Application
          </button>
        </div>
      </header>
      
      <Application applications={applications} />
    </>
  );
}

export default ApplicationList;