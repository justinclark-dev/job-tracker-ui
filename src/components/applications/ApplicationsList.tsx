import './ApplicationsList.css';
import { useEffect, useState, useRef } from 'react';
import { fetchApplications } from '../../services/job_tracker_api';
import { useNavigate } from 'react-router-dom';

const Applications = () => {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  
  /** Claude AI Help START *************************************************************** START
   *
   * I used extensive help from Claude AI in order to get the tool tip to follow the user's
   * mouse as it traverses each row of the Job Applications data table. This entire section
   * as denoted with the START and END comments, was produced by AI.
   * 
   * Here is a link to that AI chat interation:
   * https://claude.ai/share/faf17c53-63b8-4096-b529-88dda54d9b34
   */
  const tableContainerRef = useRef<HTMLDivElement>(null);

  interface TooltipState {
    show: boolean;
    x: number;
    y: number;
    rowId: number | null;
  }

  const [tooltip, setTooltip] = useState<TooltipState>({ 
    show: false, 
    x: 0, 
    y: 0,
    rowId: null
  });
  
  const handleRowEnter = (rowId: number) => {
    setTooltip(prev => ({ ...prev, show: true, rowId }));
  };

  const handleRowLeave = (rowId: number) => {
    setTooltip(prev => {
      if (prev.rowId === rowId) {
        return { show: false, x: 0, y: 0, rowId: null };
      }
      return prev;
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Check if mouse is actually inside the container
    if (tableContainerRef.current && tooltip.show) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
      // The Element.getBoundingClientRect() method returns a DOMRect object 
      // providing information about the size of an element and its position 
      // relative to the viewport.
      const rect = tableContainerRef.current.getBoundingClientRect();
      const isInside = 
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      
      if (!isInside) {
        // Mouse is outside the container, hide tooltip
        setTooltip({ show: false, x: 0, y: 0, rowId: null });
        return;
      }
      
      setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    }
  };

  const handleContainerLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, rowId: null });
  };

  // Global mousemove listener as backup
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (tooltip.show && tableContainerRef.current) {
        const rect = tableContainerRef.current.getBoundingClientRect();
        const isInside = 
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        
        if (!isInside) {
          setTooltip({ show: false, x: 0, y: 0, rowId: null });
        }
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    return () => document.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [tooltip.show]);
  /** Claude AI Help END **************************************************************** END */


  /** Claude AI Help START *************************************************************** START
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

  /** error useState()
   * This is a TypeScript generic that tells useState what types of values the state can hold.
   * This state variable can be either a string OR null, nothing else.
   * The setError function can only accept values that match the type we declared: string | null.
   * Using null as a possible value gives us a clear way to represent "no error".
   * 
   * Example used:
   * setError(error instanceof Error ? error.message : 'An error occurred')
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Represents a single job application.
   */
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

  /**
   * Props for the Application component. 
   * Allows us to give type annotation to our applications prop.
   * @property {ApplicationData[]} applications - Array of job application data to display.
   */
  interface ApplicationProps {
    applications: ApplicationData[];
  }
  /** Claude AI Help END **************************************************************** END */

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch (error) {
        /**
         * If error is an Error object, set the error state to error.message.
         * Otherwise, set the error state to the generic string 'An error occurred'
         */
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadApplications(); 
  }, []); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
                onMouseEnter={() => handleRowEnter(application.id)}
                onMouseLeave={() => handleRowLeave(application.id)}
                onClick={() => navigate(`/applications/${application.id}`)}
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
        {tooltip.show && (
          <div className='tooltip'
            style={{
              left: tooltip.x + 15,
              top: tooltip.y + 15,
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
      <h1>Job Applications</h1>
      <Application applications={applications} />
    </>
  );
}

export default Applications;