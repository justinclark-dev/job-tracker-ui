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