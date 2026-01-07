const API_URL = 'http://127.0.0.1:8000/api';

export const fetchApplications = async () => {
  const response = await fetch(`${API_URL}/job_applications`);

  if (!response.ok) {
    throw new Error(`Job Application list could not be retrieved.`);
  }

  return response.json();
};

export const fetchApplicationById = async (id: number) => {
  const response = await fetch(`${API_URL}/job_applications/${id}`);

  if (!response.ok) {
    throw new Error(`Job Application not found (ID: ${id}).`);
  }

  return response.json();
};

export const createApplication = async (applicationData: any) => {
  const response = await fetch(`${API_URL}/job_applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    throw new Error(`Job Application could not be created.`);
  }

  return response.json();
};

export const updateApplication = async (id: number, applicationData: any) => {
    const response = await fetch(`${API_URL}/job_applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error(`Job Application could not be updated.`);
    }

    return response.json();
};

export const deleteApplication = async (id: number) => {
    const response = await fetch(`${API_URL}/job_applications/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Job Application could not be deleted.`);
    }

    return response.ok;
}

export const fetchStatusOptions = async () => {
  const response = await fetch(`${API_URL}/status-choices/`);

  if (!response.ok) {
    throw new Error(`Dropdown options for Status field could not be retrieved.`);
  }

  return response.json();
};