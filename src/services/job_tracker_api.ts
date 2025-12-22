const API_URL = 'http://127.0.0.1:8000/api';

export const fetchApplications = async () => {
  const res = await fetch(`${API_URL}/job_applications`);
  const data = await res.json();
  return data;
};

export const fetchApplicationById = async (id: number) => {
  const res = await fetch(`${API_URL}/job_applications/${id}`);
  const data = await res.json();
  return data;
};

export const createApplication = async (applicationData: any) => {
  const res = await fetch(`${API_URL}/job_applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationData),
  });
  const data = await res.json();
  return data;
};

export const updateApplication = async (id: number, applicationData: any) => {
    const res = await fetch(`${API_URL}/job_applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
    });
    const data = await res.json();
    return data;
};
